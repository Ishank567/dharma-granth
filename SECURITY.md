# Security Guide: API Key Management

## ⚠️ CRITICAL: Rotate Exposed API Keys

The following keys were exposed and must be rotated **immediately**:

```

```

### Rotation Steps

1. **Delete Exposed Keys** (Google Cloud Console):
   - Go to https://console.cloud.google.com/
   - APIs & Services → Credentials
   - Delete each key listed above
   - Monitor billing for unauthorized usage

2. **Generate New API Key**:
   - Go to https://ai.google.dev/
   - Create a new API key for the Generative AI API
   - Copy and paste into `.env.local` under `GOOGLE_GENERATIVE_AI_API_KEY`

3. **Update `.env.local`**:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=sk_live_YOUR_NEW_KEY_HERE
   ```

4. **Verify Configuration**:
   ```bash
   npm run verify:interpretation -- --skip-api
   ```

---

## Recommended: Use Service Account Authentication

For batch processing, use **Service Account** credentials instead of API keys. This provides:
- ✅ Higher rate limits (200+ concurrent requests vs. 15 RPM)
- ✅ Better audit logging
- ✅ Granular permission control
- ✅ No exposed keys in environment

### Setup

1. **Create Service Account** (Google Cloud Console):
   - APIs & Services → Service Accounts
   - Create a new service account
   - Create a JSON key and download it

2. **Store Securely** (outside repository):
   ```bash
   # Example: Linux/macOS
   mkdir -p ~/.secrets
   cp ~/Downloads/service-account-key.json ~/.secrets/
   chmod 600 ~/.secrets/service-account-key.json
   
   # Windows: Store in user profile
   # C:\Users\%USERNAME%\AppData\Roaming\gcp\key.json
   ```

3. **Configure `.env.local`**:
   ```env
   GOOGLE_SA_KEY_PATH=~/.secrets/service-account-key.json
   ```

4. **Update batch script** (`scripts/sa-batch-interpret.ts`):
   - Load from environment: `process.env.GOOGLE_SA_KEY_PATH`
   - Remove hardcoded paths in `SA_KEY_PATHS`

---

## Best Practices

✅ **DO:**
- Use `.env.local` for secrets (it's gitignored)
- Rotate keys quarterly or after exposure
- Use Service Accounts for backend/batch jobs
- Use API keys only for frontend development
- Enable API key restrictions (HTTP referrer, IP whitelist)
- Monitor usage in Google Cloud Console

❌ **DON'T:**
- Commit `.env` files to git
- Share API keys in chat, logs, or documentation
- Hardcode secrets in source code
- Use the same key for multiple environments
- Store keys in version control

---

## Verification

After updating `.env.local`:

```bash
# Verify batch script can read the new key
npm run regenerate:interpretations -- --limit=10 --dry-run

# Check interpretation API is working
npm run verify:interpretation -- --skip-api
```

---

## If Compromise is Suspected

1. Delete the key immediately in Google Cloud Console
2. Check billing for unauthorized charges
3. Regenerate new keys
4. Update all environments
5. Search commit history for exposed keys:
   ```bash
   git log -S "AIzaSy" --oneline  # Search all commits
   git log -p | grep -i "api.key"
   ```

---

**Last Updated**: April 21, 2026
