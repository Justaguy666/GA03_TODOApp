# UI Developer Guide - Task Manager App

## 📁 Cấu trúc dự án cho UI Developer

Với vai trò UI Developer (Tailwind CSS + Vanilla JS), bạn sẽ làm việc trong các thư mục sau:

### 1. **View Templates (EJS)** - `src/views/`

#### `src/views/index.ejs`
- **Mục đích**: Trang chính của app
- **Bạn làm**: Chỉnh layout, spacing, colors, responsive design
- **Lưu ý**: 
  - Sử dụng Tailwind classes
  - Data được truyền từ server qua biến `tasks` (array)
  - Include partials: `<%- include('partials/header') %>`

#### `src/views/partials/`
- **header.ejs**: Header component với logo
- **footer.ejs**: Footer với copyright
- **taskItem.ejs**: Template cho mỗi task item (reusable)

**Cách tái sử dụng partials:**
```ejs
<%- include('partials/header') %>
<%- include('partials/taskItem', { task, priorityClass: 'bg-priority-high' }) %>
```

---

### 2. **Client-Side JavaScript** - `public/js/`

#### `public/js/app.js`
- **Mục đích**: Client-side rendering (CSR) và interactivity
- **Bạn làm**:
  - Event listeners (click, submit)
  - Fetch API calls để thêm/xóa/update tasks
  - DOM manipulation (append, remove elements)
  - Animation, transitions

**Pattern mẫu (Progressive Enhancement):**
```javascript
// Intercept form submit
document.querySelector('#addTaskBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Send to server
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'New task' })
    });
    
    // Update DOM without reload
    if (response.ok) {
        const newTask = await response.json();
        appendTaskToDOM(newTask);
    }
});
```

#### `public/js/ui.js` (optional)
- Utility functions cho UI: tooltips, modals, animations

---

### 3. **Tailwind CSS** - Config & Build

#### `tailwind.config.js`
- **Đã cấu hình sẵn**:
  - Custom colors (dark theme, priority colors, buttons)
  - Font family: Space Mono
  - Backdrop blur utilities
  
**Thêm custom class:**
```javascript
theme: {
  extend: {
    colors: {
      'custom-blue': '#3B82F6',
    }
  }
}
```

#### Build Tailwind CSS:
```bash
# Development (watch mode)
npm run watch:css

# Production build
npm run build:css
```

**Input file**: Nếu cần custom CSS (ngoài Tailwind), tạo file input CSS và import utilities:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-custom {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}
```

---

### 4. **Static Assets** - `public/`

```
public/
├── css/
│   └── output.css        # ❌ KHÔNG EDIT (auto-generated từ Tailwind)
├── images/
│   └── logo.png         # ✅ Thêm images ở đây
└── js/
    ├── app.js           # ✅ Client-side logic
    └── ui.js            # ✅ UI utilities
```

---

## 🎨 Design System đã implement

### Colors (Custom Tailwind)
```
bg-dark-bg           #2D2D2D  (Background)
bg-dark-card         #3A3A3A  (Card containers)
bg-dark-item         #3F3F3F  (Task items)
border-dark-border   #444444  (Borders)
text-dark-text       #EDEDED  (Main text)
text-dark-secondary  #A8A8A8  (Secondary text)

bg-priority-high     #E14B4B  (Red - urgent)
bg-priority-medium   #D9A63A  (Yellow)
bg-priority-low      #47B985  (Green)

bg-btn-primary       #5B46E5  (Purple gradient start)
bg-btn-primary-dark  #32277F  (Purple gradient end)
bg-btn-delete        #FF5E5E  (Red)
bg-btn-edit          #9E9E9E  (Gray)
```

### Typography
```
font-space           'Space Mono', monospace
text-5xl             48px (Hero title)
text-2xl             24px (Section headers, task titles)
text-base            15px (Buttons)
text-sm              14px (Due dates)
```

### Spacing & Layout
```
Desktop width:       1440px
Header height:       80px
Footer height:       80px
Task card height:    456px
Task item height:    100px
Border radius:       20px (cards), 12px (header/footer), 4px (buttons)
```

---

## 🔧 Workflow cho UI Developer

### 1. Chỉnh sửa giao diện
```bash
# 1. Mở file view cần edit
# 2. Sửa Tailwind classes trong EJS
# 3. Save file

# 4. Rebuild Tailwind (nếu thêm class mới)
npm run build:css

# 5. Refresh browser (hoặc dùng live reload)
```

### 2. Thêm interactivity (Client-side)
```bash
# Edit: public/js/app.js
# - Event listeners
# - Fetch API calls
# - DOM manipulation

# No build needed - just refresh browser
```

### 3. Test responsive
```bash
# Thêm Tailwind responsive classes:
# sm: (640px)
# md: (768px)
# lg: (1024px)
# xl: (1280px)

<div class="grid grid-cols-1 lg:grid-cols-2">
  <!-- Mobile: 1 column, Desktop: 2 columns -->
</div>
```

---

## 📝 Best Practices

### 1. **Progressive Enhancement**
- Form vẫn hoạt động khi JS tắt (submit qua server)
- JS enhance experience (no reload, smooth animations)

```html
<!-- Server-side form -->
<form action="/" method="POST">
  <input name="description" />
  <button type="submit">Add</button>
</form>

<!-- JS intercepts và enhance -->
<script>
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Fetch + update DOM
});
</script>
```

### 2. **Component Reusability**
- Dùng EJS partials cho UI components lặp lại
- Pass data qua include parameters

```ejs
<%- include('partials/taskItem', { 
  task: { id: 1, description: 'Task 1' },
  priorityClass: 'bg-priority-high'
}) %>
```

### 3. **Tailwind Best Practices**
- Dùng utility-first (tránh custom CSS khi có thể)
- Tạo custom colors trong `tailwind.config.js` thay vì hardcode
- Sử dụng `@apply` cho components phức tạp

```css
@layer components {
  .task-card {
    @apply bg-dark-card border border-dark-border rounded-[20px] p-4;
  }
}
```

### 4. **Accessibility**
```html
<!-- Add ARIA labels -->
<button aria-label="Delete task">
  <svg>...</svg>
</button>

<!-- Keyboard navigation -->
<div tabindex="0" role="button">...</div>
```

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start server
node src/server.js

# Build Tailwind CSS
npm run build:css

# Watch Tailwind (auto rebuild on changes)
npm run watch:css

# View app
# Open browser: http://localhost:3000
```

---

## 🐛 Troubleshooting

### CSS không cập nhật
```bash
# 1. Rebuild Tailwind
npm run build:css

# 2. Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### JS không chạy
```bash
# 1. Check console errors (F12)
# 2. Verify script tag in index.ejs:
<script src="/js/app.js"></script>

# 3. Check file path (public/js/app.js exists)
```

### Partials không render
```bash
# Check include path (relative to views folder)
<%- include('partials/header') %>  ✅
<%- include('./partials/header') %> ✅
<%- include('../partials/header') %> ❌
```

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [EJS Syntax](https://ejs.co/#docs)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Space Mono Font](https://fonts.google.com/specimen/Space+Mono)

---

## 🎯 Next Steps cho UI Developer

1. **Implement Add Task Form**:
   - Tạo modal/drawer khi click "Add New Task"
   - Form có fields: description, priority (dropdown), dueDate (date picker)
   - Client-side validation

2. **Implement Edit/Delete Actions**:
   - Click edit → hiện inline editing hoặc modal
   - Click delete → confirm dialog → fetch DELETE

3. **Add Animations**:
   - Task add/remove transitions
   - Checkbox toggle animation
   - Smooth scroll

4. **Responsive Design**:
   - Mobile menu for header
   - Stack columns on mobile (1 column)
   - Touch-friendly buttons

5. **Advanced Features**:
   - Drag & drop reorder
   - Filter by priority
   - Search tasks
   - Dark/light theme toggle

---

**Happy Coding! 🚀**
