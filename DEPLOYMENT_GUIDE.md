# Deployment Guide for Multi-Tenant App

## Vercel Deployment

### Issue: "Tenant not found" on Vercel

When deploying to Vercel, the app may show: `Failed to load tenant configuration: Error: Tenant multi-tenant-app-kdm1 not found in configuration`

**Solution:** Use query parameters to specify tenant on Vercel

### Option 1: Deploy with Query Parameter (Recommended for Single Tenant)

Access your app with tenant specified:
```
https://your-app.vercel.app/?tenant=tenant1
https://your-app.vercel.app/?tenant=tenant2
```

### Option 2: Setup Custom Domains for Each Tenant (Advanced)

1. **On Vercel Dashboard:**
   - Add custom domain for tenant1: `tenant1.yourdomain.com`
   - Add custom domain for tenant2: `tenant2.yourdomain.com`

2. **Update `tenants-config.json`:**
   ```json
   {
     "tenants": {
       "tenant1": {
         "id": "tenant1",
         "subdomain": "tenant1",
         // ... rest of config
       },
       "tenant2": {
         "id": "tenant2",
         "subdomain": "tenant2",
         // ... rest of config
       }
     },
     "defaultTenant": "tenant1"
   }
   ```

3. **Vercel will handle:**
   - `tenant1.yourdomain.com` → subdomain detection works
   - `tenant2.yourdomain.com` → subdomain detection works
   - Falls back to default tenant if subdomain doesn't match

### Option 3: Environment-Based Tenant Detection

1. **Add to Vercel Environment Variables:**
   - `TENANT_ID` = `tenant1` (or `tenant2`)

2. **Update Tenant Service** (if you want this approach):
   ```typescript
   private getCurrentTenantId(): string {
     // Check environment first
     const envTenant = localStorage.getItem('tenant_id');
     if (envTenant) return envTenant;
     
     // Then check query param
     const params = new URLSearchParams(window.location.search);
     const queryTenant = params.get('tenant');
     if (queryTenant) return queryTenant;
     
     // Default
     return 'tenant1';
   }
   ```

## Deployment Steps

### 1. Build the App Locally
```bash
npm run build
```

Expected output:
```
Initial chunk files   | Names         |  Raw size | Estimated transfer size
main-XXXXX.js         | main          | 895.87 kB |               185.14 kB
styles-XXXXX.css      | styles        | 105.59 kB |                 8.15 kB
polyfills-XXXXX.js    | polyfills     |  34.59 kB |                11.33 kB

                      | Initial total |   1.04 MB |               204.62 kB

Application bundle generation complete.
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin master
```

### 3. Deploy to Vercel

**Option A: Via CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via GitHub**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Angular configuration
5. Click Deploy

### 4. Access Your App

- **Tenant 1 (TechCorp):**
  ```
  https://your-app.vercel.app/?tenant=tenant1
  ```

- **Tenant 2 (FinanceHub):**
  ```
  https://your-app.vercel.app/?tenant=tenant2
  ```

## Testing on Vercel

### Test Tenant 1 (TechCorp)
1. Open: `https://your-app.vercel.app/?tenant=tenant1`
2. Login: `admin@techcorp.com` / `password`
3. See: Blue theme, Sidenav layout, all dashboard content

### Test Tenant 2 (FinanceHub)
1. Open: `https://your-app.vercel.app/?tenant=tenant2`
2. Login: `admin@financehub.com` / `password`
3. See: Green theme, Topnav layout, all dashboard content

## Common Issues & Solutions

### Issue 1: "Tenant not found" Error
**Cause:** Subdomain doesn't match configured tenants
**Solution:** 
- Use query parameter: `?tenant=tenant1`
- Or setup custom domain with correct subdomain

### Issue 2: Styles not loading on Vercel
**Cause:** Asset path issues
**Solution:**
- Ensure `public/` folder is included in build
- Check `angular.json` assets configuration
- Verify CSS paths are relative

### Issue 3: Session not persisting
**Cause:** localStorage cleared on page reload
**Solution:**
- localStorage is working as designed
- Recommend adding "Remember Me" feature:
  ```typescript
  const rememberMe = document.getElementById('rememberMe').checked;
  if (rememberMe) {
    localStorage.setItem('remember_credentials', email);
  }
  ```

## Production Optimizations

### Current Configuration (angular.json)
```json
"production": {
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "1.1MB",
      "maximumError": "1.5MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "10kB",
      "maximumError": "16kB"
    }
  ],
  "outputHashing": "all",
  "optimization": true,
  "sourceMap": false,
  "namedChunks": false,
  "aot": true
}
```

### Bundle Size: ~1.04 MB
- Main chunk: ~895 kB (minified)
- Styles: ~105 kB (compressed to 8 kB)
- Polyfills: ~34 kB (compressed to 11 kB)
- **Transfer size: ~204 kB** (with gzip compression)

## Environment Variables (Optional)

Create `.env.production` for production-specific settings:
```
# Not needed for basic deployment, but can add:
NG_APP_API_URL=https://api.yourdomain.com
NG_APP_TENANT=tenant1
```

## URL Schemes for Different Scenarios

| Scenario | URL |
|----------|-----|
| Vercel auto domain, default tenant | `https://app.vercel.app` |
| Vercel auto domain, tenant1 | `https://app.vercel.app?tenant=tenant1` |
| Vercel auto domain, tenant2 | `https://app.vercel.app?tenant=tenant2` |
| Custom domain tenant1 | `https://tenant1.yourdomain.com` |
| Custom domain tenant2 | `https://tenant2.yourdomain.com` |
| Localhost dev, tenant1 | `http://localhost:4200?tenant=tenant1` |
| Localhost dev, tenant2 | `http://localhost:4200?tenant=tenant2` |

## Rollback

If there are issues after deployment:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Click on previous successful deployment
   - Click "Redeploy"

2. **Via Git:**
   ```bash
   git revert HEAD
   git push origin master
   # Vercel auto-redeploys
   ```

## Support & Debugging

### View Vercel Logs
```bash
vercel logs [project-url]
```

### Check Browser Console
1. Open app in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for "Loaded tenant" messages

Example successful output:
```
Loaded tenant: tenant1 (TechCorp)
```

### Check Network Tab
1. Open DevTools → Network tab
2. Verify `/tenants-config.json` loads successfully
3. Check HTTP status (should be 200)
