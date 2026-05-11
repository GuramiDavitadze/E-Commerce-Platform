'use client';
 
import { useState } from 'react';
import { useCategories } from '@/hooks/useProducts';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useAdmin';
import type { Category, CreateCategoryPayload } from '@/types';
import styles from './categories.module.scss';
 
type ModalMode = 'create' | 'edit';
 
const EMPTY_FORM: CreateCategoryPayload = { content: '', category_slug: '' };
 
function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
 
export default function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();
 
  const [modal, setModal]               = useState<{ mode: ModalMode; category?: Category } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [search, setSearch]             = useState('');
 
  const categories = data?.data ?? [];
  const filtered   = categories.filter((c) =>
    !search || c.content.toLowerCase().includes(search.toLowerCase()) || c.category_slug.includes(search.toLowerCase())
  );
 
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    deleteCategory.mutate(deleteConfirm.id, {
      onSuccess: () => setDeleteConfirm(null),
    });
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>{categories.length} total categories</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal({ mode: 'create' })}>
          + New category
        </button>
      </div>
 
      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.searchInput}
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
      </div>
 
      {/* States */}
      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeletonCard} />)}
        </div>
      )}
 
      {isError && (
        <div className={styles.errorState}>
          <span>⚠️</span>
          <p>Failed to load categories.</p>
          <button className={styles.retryBtn} onClick={() => refetch()}>Try again</button>
        </div>
      )}
 
      {!isLoading && !isError && filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🗂</span>
          <p className={styles.emptyTitle}>{search ? 'No categories found' : 'No categories yet'}</p>
          <p className={styles.emptyText}>{search ? 'Try a different search term' : 'Create your first category to organise products'}</p>
          {!search && (
            <button className={styles.newBtn} onClick={() => setModal({ mode: 'create' })}>+ New category</button>
          )}
        </div>
      )}
 
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((cat) => (
            <div key={cat.id} className={styles.card}>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{cat.content}</h3>
                <span className={styles.cardSlug}>/{cat.category_slug}</span>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => setModal({ mode: 'edit', category: cat })}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(cat)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* Create / Edit Modal */}
      {modal && (
        <CategoryModal
          mode={modal.mode}
          category={modal.category}
          onClose={() => setModal(null)}
        />
      )}
 
      {/* Delete confirm */}
      {deleteConfirm && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3 className={styles.confirmTitle}>Delete category?</h3>
            <p className={styles.confirmText}>
              <strong>"{deleteConfirm.content}"</strong> will be permanently deleted.
              Products in this category will lose their category association.
            </p>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className={styles.confirmDelete}
                onClick={handleDeleteConfirm}
                disabled={deleteCategory.isPending}
              >
                {deleteCategory.isPending ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── Modal ────────────────────────────────────────────────────────────────────
 
function CategoryModal({
  mode, category, onClose,
}: {
  mode: ModalMode;
  category?: Category;
  onClose: () => void;
}) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
 
  const [form, setForm]     = useState<CreateCategoryPayload>(
    category ? { content: category.content, category_slug: category.category_slug } : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<CreateCategoryPayload>>({});
  const [apiError, setApiError] = useState('');
  const [autoSlug, setAutoSlug] = useState(!category);
 
  const setContent = (val: string) => {
    setForm((f) => ({ ...f, content: val, ...(autoSlug ? { category_slug: slugify(val) } : {}) }));
    setErrors((e) => ({ ...e, content: undefined }));
  };
 
  const setSlug = (val: string) => {
    setAutoSlug(false);
    setForm((f) => ({ ...f, category_slug: slugify(val) }));
    setErrors((e) => ({ ...e, category_slug: undefined }));
  };
 
  const validate = () => {
    const errs: Partial<CreateCategoryPayload> = {};
    if (!form.content.trim())       errs.content = 'Name is required';
    if (!form.category_slug.trim()) errs.category_slug = 'Slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
    try {
      if (mode === 'create') await createCategory.mutateAsync(form);
      else if (category)    await updateCategory.mutateAsync({ id: category.id, payload: form });
      onClose();
    } catch (err: any) {
      setApiError(err?.message || 'Something went wrong.');
    }
  };
 
  const isPending = createCategory.isPending || updateCategory.isPending;
 
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div>
            <h2 className={styles.modalTitle}>{mode === 'create' ? 'New category' : 'Edit category'}</h2>
            <p className={styles.modalSub}>{mode === 'create' ? 'Add a new product category' : `Editing: ${category?.content}`}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
 
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {apiError && <div className={styles.errorBanner}>{apiError}</div>}
 
          <div className={styles.field}>
            <label className={styles.label}>Category name *</label>
            <input
              className={`${styles.input} ${errors.content ? styles.inputError : ''}`}
              value={form.content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Electronics"
              autoFocus
            />
            {errors.content && <span className={styles.fieldError}>{errors.content}</span>}
          </div>
 
          <div className={styles.field}>
            <label className={styles.label}>Slug *</label>
            <div className={styles.slugWrap}>
              <span className={styles.slugPrefix}>/</span>
              <input
                className={`${styles.input} ${styles.slugInput} ${errors.category_slug ? styles.inputError : ''}`}
                value={form.category_slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. electronics"
              />
            </div>
            <span className={styles.fieldHint}>Used in URLs — auto-generated from name</span>
            {errors.category_slug && <span className={styles.fieldError}>{errors.category_slug}</span>}
          </div>
 
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending
                ? <><span className={styles.spinner} /> Saving…</>
                : mode === 'create' ? 'Create category' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}