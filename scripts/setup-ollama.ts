/**
 * Setup Ollama for Local AI
 * =========================
 * Checks, downloads, and configures Ollama for verse interpretations
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const OLLAMA_URL = 'https://ollama.com/download/OllamaSetup.exe';
const DOWNLOAD_PATH = path.join(process.env.TEMP || 'C:\\temp', 'OllamaSetup.exe');

function log(msg: string) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function isOllamaInstalled(): boolean {
  try {
    execSync('ollama --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function isOllamaRunning(): boolean {
  try {
    const response = execSync('curl -s http://localhost:11434/api/tags', {
      encoding: 'utf-8',
      timeout: 2000
    });
    return response.includes('models');
  } catch {
    return false;
  }
}

async function downloadOllama(): Promise<boolean> {
  log('📥 Downloading Ollama installer...');
  log(`   URL: ${OLLAMA_URL}`);
  log(`   Save to: ${DOWNLOAD_PATH}`);

  return new Promise((resolve) => {
    const file = fs.createWriteStream(DOWNLOAD_PATH);
    https.get(OLLAMA_URL, (response) => {
      if (response.statusCode !== 200) {
        log(`   ❌ Download failed: HTTP ${response.statusCode}`);
        resolve(false);
        return;
      }

      let downloaded = 0;
      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (downloaded % 1000000 === 0) {
          log(`   Downloaded: ${(downloaded / 1024 / 1024).toFixed(1)} MB`);
        }
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        log('   ✅ Download complete');
        resolve(true);
      });
    }).on('error', (err) => {
      log(`   ❌ Download error: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🦙 Ollama Setup for Dharma Granth\n');

  // Step 1: Check if installed
  if (isOllamaInstalled()) {
    log('✅ Ollama is installed');
  } else {
    log('⚠️  Ollama not found');
    log('\n📋 Manual Installation Required:');
    log('   1. Download: https://ollama.com/download');
    log('   2. Run OllamaSetup.exe');
    log('   3. Wait for installation to complete');
    log('   4. Ollama will run in system tray');
    log('\n   Or use winget (if available):');
    log('   winget install Ollama.Ollama');
    console.log('\n⏸️  Setup paused. Install Ollama, then run this script again.');
    return;
  }

  // Step 2: Check if running
  if (isOllamaRunning()) {
    log('✅ Ollama service is running');
  } else {
    log('⚠️  Ollama not running. Starting...');
    try {
      // Try to start Ollama
      spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
      log('   🔄 Starting Ollama service...');
      await new Promise(r => setTimeout(r, 3000));

      if (isOllamaRunning()) {
        log('   ✅ Ollama started successfully');
      } else {
        log('   ⚠️  Please start Ollama manually from the system tray');
        return;
      }
    } catch (e) {
      log(`   ❌ Failed to start: ${(e as Error).message}`);
      return;
    }
  }

  // Step 3: Check available models
  log('\n📦 Checking available models...');
  try {
    const result = execSync('ollama list', { encoding: 'utf-8' });
    const models = result.split('\n').filter(line => line.trim() && !line.startsWith('NAME'));

    if (models.length === 0) {
      log('   ⚠️  No models found');
      log('\n   Pull a model:');
      log('     ollama pull llama3.2    (fast, 2GB)');
      log('     ollama pull gemma2:2b   (Google, good for Hindi)');
      log('     ollama pull mistral     (balanced)');
      log('\n   Recommended: gemma2:2b for Hindi/Sanskrit support');
    } else {
      log(`   ✅ Found ${models.length} models:`);
      models.forEach(m => log(`      - ${m.split(/\s+/)[0]}`));
    }
  } catch (e) {
    log(`   ⚠️  Could not list models: ${(e as Error).message}`);
  }

  // Step 4: Instructions for generating interpretations
  log('\n🎯 Next Steps:');
  log('   1. Pull a model: ollama pull gemma2:2b');
  log('   2. Run: npx tsx scripts/local-llm-interpret.ts 1');
  log('   3. Or process all: npx tsx scripts/local-llm-interpret.ts --all');
  log('\n📚 Model Info:');
  log('   - llama3.2: Fast, good English, ~2GB');
  log('   - gemma2:2b: Good multilingual (Hindi), ~1.6GB');
  log('   - mistral: Balanced quality, ~4GB');

  console.log('\n✅ Setup complete! Pull a model to start generating AI interpretations.');
}

main().catch(console.error);
