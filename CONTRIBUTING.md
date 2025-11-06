# Contributing to ChatKu

Terima kasih atas minat Anda untuk berkontribusi pada ChatKu! 🎉

## 📋 Code of Conduct

- Bersikap sopan dan profesional
- Hormati semua kontributor
- Fokus pada kode dan solusi, bukan personal

## 🚀 Quick Start

1. Fork repository
2. Clone fork Anda:

```bash
git clone https://github.com/YOUR_USERNAME/chatku.git
cd chatku
```

3. Install dependencies:

```bash
bun install
```

4. Setup environment (lihat SETUP.md)

5. Buat branch baru:

```bash
git checkout -b feature/nama-fitur
```

## 🎯 Development Guidelines

### Code Style

1. **TypeScript**: Semua code harus fully typed
2. **No Comments**: Code harus self-explanatory (sesuai requirement)
3. **Clean Code**: Ikuti prinsip SOLID
4. **Formatting**: ESLint akan auto-format

### Component Guidelines

```typescript
"use client";

import { useState } from "react";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  const [state, setState] = useState("");

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};
```

**Rules:**

- ✅ Use functional components
- ✅ Use TypeScript interfaces for props
- ✅ Export with named export
- ✅ Use 'use client' directive when needed

### Hook Guidelines

```typescript
"use client";

import { useState, useEffect } from "react";

export const useCustomHook = (param: string) => {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    // Logic
  }, [param]);

  return { data };
};
```

**Rules:**

- ✅ Prefix with 'use'
- ✅ Single responsibility
- ✅ Return object with named properties
- ✅ Handle cleanup in useEffect

## 🧪 Testing (Planned)

```bash
bun test
```

### Test Guidelines

- Write tests for new features
- Cover edge cases
- Mock external services
- Test user interactions

## 📝 Commit Messages

Format: `type(scope): message`

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

**Examples:**

```
feat(chat): add message reactions
fix(presence): handle disconnect gracefully
docs(readme): update setup instructions
```

## 🔄 Pull Request Process

1. Update your branch:

```bash
git fetch origin
git rebase origin/main
```

2. Run checks:

```bash
bun run lint
bun run build
```

3. Push to your fork:

```bash
git push origin feature/nama-fitur
```

4. Create Pull Request dengan:

   - Clear title
   - Description of changes
   - Screenshots (if UI changes)
   - Link to related issues

5. Wait for review

## 🐛 Bug Reports

Gunakan GitHub Issues dengan template:

```
**Describe the bug**
Clear description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Node: [e.g. 20.0.0]
```

## 💡 Feature Requests

Gunakan GitHub Issues dengan template:

```
**Feature Description**
Clear description of the feature

**Use Case**
Why is this needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other approaches considered
```

## 🏗️ Architecture Decisions

Sebelum membuat perubahan besar:

1. Buka GitHub Discussion
2. Jelaskan proposal
3. Tunggu feedback
4. Implement setelah approved

## 📚 Resources

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [SETUP.md](SETUP.md) - Setup guide
- [Next.js Docs](https://nextjs.org/docs)
- [Ably Docs](https://ably.com/docs)

## ✅ Checklist

Sebelum submit PR:

- [ ] Code follows style guide
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Tested manually
- [ ] Documentation updated
- [ ] Commit messages follow convention

## 🎉 Recognition

Contributors akan ditambahkan ke README.md!

Thank you for contributing! 🚀
