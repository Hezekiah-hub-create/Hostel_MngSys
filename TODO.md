# HMS Deployment TODO - UPDATED WITH YOUR BE URL

## Backend Live: https://hostel-mng-sys-server.vercel.app/

## Steps Progress
- [x] CORS prod-ready (all *.vercel.app)
- [x] Vite base: './' (fixes 404 refresh)
- [x] API URLs env-aware (VITE_API_URL)

### Remaining:
### 1. [ ] Push changes & redeploy
   git add . && git commit -m "Prod API URL + CORS" && git push

### 2. [ ] Set FE Env Var on Vercel
   - Client project: Settings > Env Vars > VITE_API_URL = https://hostel-mng-sys-server.vercel.app/api
   - Staff project: Same
   - Redeploy

### 3. [ ] Test Login/Register
   - No more localhost:5000 errors
   - Verify DB connection on BE (check Vercel logs)

### 4. [COMPLETE] 🎉 Live HMS!

**Verify BE:** curl https://hostel-mng-sys-server.vercel.app/
**FE Test:** After env var, login should work end-to-end.

