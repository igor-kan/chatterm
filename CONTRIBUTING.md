# Contributing to chatterm

Thank you for your interest in contributing to chatterm! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow:

- **Be respectful**: Use welcoming and inclusive language
- **Be collaborative**: Disagreements happen, but stay constructive
- **Be patient**: Remember that people have different skill levels and backgrounds
- **Be helpful**: Offer constructive feedback and help others learn

## 🚀 Getting Started

### Prerequisites

- Node.js 20.11.0 or later
- npm or bun package manager
- Git version control

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chatterm.git
   cd chatterm
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/igor-kan/chatterm.git
   ```

## 🛠️ Development Setup

### Installation

```bash
npm install
# or
bun install
```

### Environment Configuration

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```
2. **Configure environment variables** as needed
3. **Review the configuration** in the `.env` file

### Verification

Run the following to ensure everything is working:

```bash
npm run dev
# or
bun dev
```

The application should start at `http://localhost:3000`

## 🔄 Making Changes

### Branch Strategy

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Use descriptive branch names**:
   - `feature/add-user-authentication`
   - `bugfix/fix-login-redirect`
   - `docs/update-api-documentation`
   - `refactor/simplify-user-service`

### Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
- `feat(auth): add user login functionality`
- `fix(ui): resolve button alignment issue`
- `docs(api): update endpoint documentation`

### Code Quality

Before committing, ensure your code meets our standards:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass locally
- [ ] Code has been linted and formatted
- [ ] Documentation has been updated if needed
- [ ] Commit messages follow conventional commit format
- [ ] Branch is up to date with `main`

### Submitting Your PR

1. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Reference to related issues** (e.g., "Fixes #123")
   - **Screenshots** for UI changes
   - **Testing instructions** for reviewers

### PR Template

```markdown
## Summary
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

- **Automatic checks** must pass (CI/CD, linting, tests)
- **Code review** by at least one maintainer
- **Address feedback** promptly and professionally
- **Squash commits** if requested before merge

## 📏 Coding Standards

### TECH_STACK Specific Guidelines

#### TypeScript/Next.js

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Use React hooks appropriately
- Follow Next.js performance best practices

### General Principles

- **Write self-documenting code** with clear variable and function names
- **Keep functions small** and focused on a single responsibility
- **Use consistent naming conventions** throughout the project
- **Add comments** for complex business logic
- **Follow DRY principles** (Don't Repeat Yourself)
- **Handle errors gracefully** with appropriate error messages

### File Structure

```
src/
  components/
  pages/
  lib/
  hooks/
  types/
  styles/
public/
__tests__/
README.md
package.json
.env.example
```

## 🧪 Testing Guidelines

### Test Structure

```
__tests__/
  components/
  pages/
  utils/
components/
  Component.test.tsx
```

### Writing Tests

- **Write tests** for new features and bug fixes
- **Follow AAA pattern**: Arrange, Act, Assert
- **Use descriptive test names** that explain what is being tested
- **Mock external dependencies** appropriately
- **Aim for good coverage** but focus on meaningful tests

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📚 Documentation

### Code Documentation

- **Add JSDoc/docstrings** for functions and classes
- **Include parameter and return type information**
- **Provide usage examples** for complex functions
- **Document any side effects or assumptions**

### User Documentation

- **Update README.md** for new features or changes
- **Add examples** to demonstrate usage
- **Update API documentation** if applicable
- **Include screenshots** for UI changes

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if the issue persists
3. **Gather relevant information** (OS, browser, version, etc.)

### Creating a Good Issue

**Bug Reports:**
- Clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error messages
- Environment information

**Feature Requests:**
- Clear description of the proposed feature
- Use case and motivation
- Possible implementation approach
- Examples from other projects (if any)

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high/medium/low`: Issue priority

## 🌟 Recognition

Contributors will be recognized in:
- **GitHub contributors page**
- **Project README** (for significant contributions)
- **Release notes** (for major features)
- **Annual contributor appreciation**

## 💬 Community

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Email**: For private or security-related matters

### Community Guidelines

- **Be inclusive**: Welcome people of all backgrounds and skill levels
- **Be patient**: Help others learn and grow
- **Be constructive**: Provide helpful feedback
- **Be professional**: Maintain a respectful tone

## 📄 License

By contributing to chatterm, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## 🙏 Acknowledgments

Thank you to all contributors who help make this project better! Your time and effort are greatly appreciated.

---

**Questions?** Feel free to open an issue or reach out to the maintainers.

**Happy coding!** 🎉