# You’re not passing a component. You’re passing an element.

React gives you two ways to hand something renderable down to a child. The code looks nearly identical; the render behavior is not. The live demo (`/demo`) and guide (`/guide`) on this site pair **console logs** with **RenderSpotlight** colors (emerald → sky → violet → rose) so you can see which boundaries commit.

---

## Pattern 1 — Component as prop

```tsx
<Child ComponentToRender={SomeComponent} />
// inside Child:
return <ComponentToRender />
```

`Child` receives a **function reference**. Each time `Child` renders, it invokes that function and **creates a new React element**.

**Consequence:** the inner component re-renders whenever `Child` re-renders — both parent-driven and child-driven updates.

---

## Pattern 2 — Component as children

```tsx
<Child>
  <SomeComponent />
</Child>
```

The **parent’s** JSX evaluates `<SomeComponent />` and produces a **React element object**. That object is passed as `props.children`. `Child` renders `{children}`; it does not create that element.

**Consequence:** when **only** `Child`’s state updates, `props.children` can remain the **same reference** as before (parent did not re-render), so the inner component may **not** re-render. When the **parent** re-renders, it builds a **new** element and the inner runs again.

`children` is **not** magic — it’s a prop. The useful mental model is **ownership**: who created the element object.

---

## Pattern 3 — `React.memo(Child)` + prop

```tsx
const MemoChild = React.memo(Child);
<MemoChild ComponentToRender={SomeComponent} />
```

React **shallow-compares** props before calling `Child`. A stable module-level `ComponentToRender` means unrelated parent updates can **skip** `Child` entirely — no inner render from that path.

This is an **explicit** gate; Pattern 2 can achieve a similar *effect* for child-only updates through **where** the element is created.

---

## Unifying model

**Who creates the element determines who re-renders it** (subject to parent updates and memo).

| Pattern | Element created by | Natural boundary | Explicit boundary |
|--------|---------------------|------------------|-------------------|
| Prop | Child | None | `React.memo` |
| Children | Parent | Ownership | Often unnecessary |
| Memo + prop | Child | None | `React.memo` |

---

*April 2026 · `react-props-children-memo`*
