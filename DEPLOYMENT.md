# Frontend Deployment Guide

## Overview

The frontend is a static React application built with Vite. After building, it produces static HTML, CSS, and JavaScript files that can be served by any web server.

## Building for Production

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### 3. Build the Application

```bash
npm run build
```

This creates a `dist/` folder with all production-ready files.

### 4. Test the Build Locally (Optional)

```bash
npm run preview
```

This serves the production build at `http://localhost:3000`

## Deployment Options

### Option 1: Manual Deployment

Copy the `dist/` folder contents to your web server:

```bash
# Example: Copy to web server document root
scp -r dist/* user@server:/var/www/html/

# Or using rsync
rsync -avz dist/ user@server:/var/www/html/
```

### Option 2: Using Your Web Server

Simply point your web server's document root to the `dist/` folder or copy the contents there.

## Web Server Configuration

### Important Requirements

Your web server MUST be configured to:

1. **Serve index.html for all routes** (for React Router to work)
2. **Proxy /api requests** to your backend server
3. **Set cache headers** for static assets

### Example Configurations

#### NGINX

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Point to your dist folder
    root /path/to/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect all requests to index.html except for existing files
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

#### Caddy

```caddy
your-domain.com {
    root * /path/to/dist
    encode gzip
    
    # Handle React Router
    try_files {path} /index.html
    
    # Proxy API requests
    reverse_proxy /api/* localhost:5000
    
    # Cache headers
    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, max-age=31536000, immutable"
}
```

## SSL/TLS Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install certbot

# For NGINX
sudo certbot --nginx -d your-domain.com

# For Apache
sudo certbot --apache -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## Environment Variables

The frontend uses environment variables prefixed with `VITE_`:

- `VITE_API_URL`: Backend API URL (required)

**Important:** 
- Environment variables are embedded at build time
- Rebuild the application if you change environment variables
- Never commit `.env.production` with sensitive data

## Build Output

The `dist/` folder contains:

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Main CSS bundle
│   └── [other assets]     # Images, fonts, etc.
└── [other files]
```

## Performance Optimization

The build is already optimized with:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Source map generation (disabled in production)

Additional optimizations you can add:
- CDN for static assets
- HTTP/2 or HTTP/3
- Brotli compression
- Service Worker for offline support

## Troubleshooting

### Issue: Blank page after deployment

**Solution:** Check browser console for errors. Common causes:
- Incorrect `VITE_API_URL` in `.env.production`
- Web server not configured to serve index.html for all routes
- CORS issues with backend

### Issue: API calls failing

**Solution:**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure API proxy is configured in web server

### Issue: 404 errors on page refresh

**Solution:** Configure your web server to serve `index.html` for all routes (see configurations above)

### Issue: Assets not loading

**Solution:**
- Check file permissions on the server
- Verify the base path in `vite.config.ts` if deploying to a subdirectory
- Check browser console for 404 errors

## Deployment Checklist

- [ ] Environment variables configured in `.env.production`
- [ ] Application built with `npm run build`
- [ ] Build tested locally with `npm run preview`
- [ ] `dist/` folder copied to web server
- [ ] Web server configured to serve index.html for all routes
- [ ] API proxy configured in web server
- [ ] SSL/TLS certificate installed
- [ ] Cache headers configured for static assets
- [ ] Gzip/Brotli compression enabled
- [ ] Security headers configured
- [ ] DNS records pointing to server
- [ ] Application accessible and working

## Monitoring

After deployment, monitor:
- Application accessibility
- API response times
- Browser console for errors
- Server logs for issues
- SSL certificate expiration

## Updates

To deploy updates:

```bash
# 1. Pull latest code
git pull

# 2. Install any new dependencies
npm install

# 3. Rebuild
npm run build

# 4. Deploy new dist folder
scp -r dist/* user@server:/var/www/html/

# 5. Clear browser cache or use cache busting
```

## Support

For issues:
- Check browser console for errors
- Review web server error logs
- Verify backend API is accessible
- Check CORS configuration

---

**Note:** This frontend is designed to work with the Taahod backend API. Ensure the backend is deployed and accessible before deploying the frontend.
