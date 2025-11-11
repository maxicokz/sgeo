# Инструкция по развертыванию SGEO Dashboard

## Вариант 1: Static Export (для PHP хостинга)

Этот метод позволяет развернуть приложение на любом веб-хостинге, включая PHP хостинг.

### Шаг 1: Установка зависимостей

```bash
cd frontend
npm install
```

### Шаг 2: Сборка статического сайта

```bash
npm run build
```

После выполнения команды будет создана папка `out/` с готовыми статическими файлами.

### Шаг 3: Развертывание на PHP хостинге

#### Через FTP/SFTP:

1. Подключитесь к вашему хостингу через FTP клиент (FileZilla, WinSCP и т.д.)
2. Перейдите в корневую папку сайта (обычно `public_html/` или `www/`)
3. Загрузите **все файлы** из папки `frontend/out/` в корневую папку
4. Убедитесь, что файл `.htaccess` также загружен

#### Через SSH (если доступен):

```bash
# На вашем компьютере
cd frontend
npm run build

# Загрузка на сервер
scp -r out/* user@your-server.com:/path/to/public_html/

# Или через rsync
rsync -avz out/ user@your-server.com:/path/to/public_html/
```

### Шаг 4: Проверка

Откройте ваш сайт в браузере. Все страницы должны работать корректно.

---

## Вариант 2: Node.js хостинг (для полной функциональности)

Если у вас есть доступ к хостингу с Node.js (VPS, Vercel, Railway и т.д.):

### Развертывание на Vercel (Рекомендуется):

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Разверните проект:
```bash
cd frontend
vercel
```

3. Следуйте инструкциям в терминале

### Развертывание на VPS с Node.js:

1. Установите Node.js 18+ на сервере:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Установите PM2 для управления процессом:
```bash
sudo npm install -g pm2
```

3. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd sgeo/frontend
```

4. Установите зависимости и соберите:
```bash
npm install
npm run build
```

5. Запустите через PM2:
```bash
pm2 start npm --name "sgeo-dashboard" -- start
pm2 save
pm2 startup
```

6. Настройте Nginx как reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Вариант 3: Docker (для контейнеризации)

### Создайте Dockerfile в папке frontend/:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/out ./out
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000

CMD ["npx", "serve", "out", "-p", "3000"]
```

### Соберите и запустите:

```bash
docker build -t sgeo-dashboard .
docker run -p 3000:3000 sgeo-dashboard
```

---

## Проверка развертывания

После развертывания проверьте следующие страницы:

- `/` - Главный дашборд
- `/analytics` - Аналитика
- `/activity` - Активность
- `/topics` - Темы
- `/sources` - Источники
- `/llm-systems` - LLM Системы
- `/reports` - Отчёты
- `/goals` - Цели
- `/settings` - Настройки

Все страницы должны загружаться без ошибок.

---

## Возможные проблемы

### 1. 404 на подстраницах (PHP хостинг)

**Решение:** Убедитесь, что файл `.htaccess` загружен и `mod_rewrite` включен на хостинге.

### 2. Медленная загрузка

**Решение:** Убедитесь, что gzip сжатие работает. Проверьте настройки кэширования в `.htaccess`.

### 3. Ошибки JavaScript

**Решение:** Проверьте консоль браузера. Возможно, путь к статическим файлам неверный. Убедитесь, что файлы из папки `_next/` загружены.

---

## Рекомендации по хостингу

### Для static export (Вариант 1):
- ✅ Netlify (бесплатно)
- ✅ Vercel (бесплатно)
- ✅ GitHub Pages
- ✅ Любой PHP хостинг (Beget, Timeweb, REG.RU и т.д.)
- ✅ AWS S3 + CloudFront

### Для Node.js (Вариант 2):
- ✅ Vercel (рекомендуется, бесплатно)
- ✅ Railway (бесплатно)
- ✅ Render (бесплатно)
- ✅ DigitalOcean App Platform
- ✅ VPS с Node.js

---

## Оптимизация производительности

1. **Включите CDN** для статических ресурсов
2. **Настройте кэширование** в `.htaccess` (уже настроено)
3. **Минимизируйте запросы** - все ресурсы уже оптимизированы
4. **Используйте HTTP/2** на сервере для лучшей производительности

---

## Поддержка

При возникновении проблем проверьте:
1. Логи сервера
2. Консоль браузера (F12)
3. Network вкладку в DevTools
4. Версию Node.js (должна быть 18+)
