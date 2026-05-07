'use client';
 
import { useState, useRef, useCallback } from 'react';
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadProductImage,
} from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useProducts';
import type { Product, CreateProductPayload, ProductStatus } from '@/types';
import styles from './products.module.scss';
 
type ViewMode = 'table' | 'grid';
type SortKey = 'name' | 'price' | 'quantity' | 'created_at';
type ModalMode = 'create' | 'edit';
 
const EMPTY_FORM: CreateProductPayload = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  category_id: '',
  status: true,
};
 
export default function AdminProductsPage() {
  const { data, isLoading, refetch } = useAdminProducts();
  const { data: categoriesData } = useCategories();
  const deleteProduct = useDeleteProduct();
 
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | ''>('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [modal, setModal] = useState<{ mode: ModalMode; product?: Product } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
 
  const products:Product[]|any = data?.data ?? [];
  const categories = categoriesData?.data ?? [];
 
  // ─── Filter + sort ────────────────────────────────────────────────────────
 
  const filtered = products
    .filter((p:Product) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !categoryFilter || p.category?.content.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = typeof statusFilter !=="boolean" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a:any, b:any) => {
      let aVal: string | number = a[sortKey] ?? '';
      let bVal: string | number = b[sortKey] ?? '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
 
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };
 
  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <span className={styles.sortIconInactive}>↕</span>
    ) : (
      <span className={styles.sortIconActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>
    );
 
  // ─── Stats ────────────────────────────────────────────────────────────────
 
  const totalActive   = products.filter((p:Product) => p.status).length;
  const totalInactive = products.filter((p:Product) => !p.status).length;
  const outOfStock    = products.filter((p:Product) => p.quantity === 0).length;
  const lowStock      = products.filter((p:Product) => p.quantity > 0 && p.quantity <= 5).length;
 
  // ─── Delete ───────────────────────────────────────────────────────────────
 
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    deleteProduct.mutate(deleteConfirm.id, {
      onSuccess: () => setDeleteConfirm(null),
    });
  };
 
  // ─── Render ───────────────────────────────────────────────────────────────
 
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>{products.length} total products</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal({ mode: 'create' })}>
          <span>+</span> New product
        </button>
      </div>
 
      {/* Quick stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <span className={styles.quickStatValue}>{totalActive}</span>
          <span className={styles.quickStatLabel}>Active</span>
        </div>
        <div className={styles.quickStatDivider} />
        <div className={styles.quickStat}>
          <span className={styles.quickStatValue}>{totalInactive}</span>
          <span className={styles.quickStatLabel}>Inactive</span>
        </div>
        <div className={styles.quickStatDivider} />
        <div className={`${styles.quickStat} ${lowStock > 0 ? styles.quickStatWarn : ''}`}>
          <span className={styles.quickStatValue}>{lowStock}</span>
          <span className={styles.quickStatLabel}>Low stock</span>
        </div>
        <div className={styles.quickStatDivider} />
        <div className={`${styles.quickStat} ${outOfStock > 0 ? styles.quickStatDanger : ''}`}>
          <span className={styles.quickStatValue}>{outOfStock}</span>
          <span className={styles.quickStatLabel}>Out of stock</span>
        </div>
      </div>
 
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
 
          {/* Category filter */}
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.content}>{c.content}</option>
            ))}
          </select>
 
          {/* Status filter */}
          <select
            className={styles.filterSelect}
            value={String(statusFilter)}
            onChange={(e) => setStatusFilter(e.target.value ===''?"":e.target.value ==="true")}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
 
          {/* Clear filters */}
          {(search || categoryFilter || typeof statusFilter ==="boolean" ) && (
            <button
              className={styles.clearBtn}
              onClick={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); }}
            >
              Clear filters
            </button>
          )}
        </div>
 
        <div className={styles.toolbarRight}>
          <span className={styles.resultCount}>{filtered.length} results</span>
          {/* View toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'table' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              ☰
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>
 
      {/* Content */}
      {isLoading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📦</span>
          <p className={styles.emptyTitle}>No products found</p>
          <p className={styles.emptyText}>
            {search || categoryFilter || statusFilter
              ? 'Try adjusting your filters'
              : 'Create your first product to get started'}
          </p>
          {!search && !categoryFilter && !statusFilter && (
            <button className={styles.newBtn} onClick={() => setModal({ mode: 'create' })}>
              + New product
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <TableView
          products={filtered}
          onEdit={(p) => setModal({ mode: 'edit', product: p })}
          onDelete={(p) => setDeleteConfirm(p)}
          onSort={handleSort}
          SortIcon={SortIcon}
        />
      ) : (
        <GridView
          products={filtered}
          onEdit={(p) => setModal({ mode: 'edit', product: p })}
          onDelete={(p) => setDeleteConfirm(p)}
        />
      )}
 
      {/* Product modal */}
      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          categories={categories}
          onClose={() => setModal(null)}
        />
      )}
 
      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3 className={styles.confirmTitle}>Delete product?</h3>
            <p className={styles.confirmText}>
              <strong>"{deleteConfirm.name}"</strong> will be permanently deleted.
              This action cannot be undone.
            </p>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className={styles.confirmDelete}
                onClick={handleDeleteConfirm}
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── Table View ───────────────────────────────────────────────────────────────
 
function TableView({
  products,
  onEdit,
  onDelete,
  onSort,
  SortIcon,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onSort: (key: 'name' | 'price' | 'quantity' | 'created_at') => void;
  SortIcon: React.FC<{ col: 'name' | 'price' | 'quantity' | 'created_at' }>;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thSortable} onClick={() => onSort('name')}>
              Product <SortIcon col="name" />
            </th>
            <th>Category</th>
            <th className={styles.thSortable} onClick={() => onSort('price')}>
              Price <SortIcon col="price" />
            </th>
            <th className={styles.thSortable} onClick={() => onSort('quantity')}>
              Stock <SortIcon col="quantity" />
            </th>
            <th>Status</th>
            <th className={styles.thSortable} onClick={() => onSort('created_at')}>
              Created <SortIcon col="created_at" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productThumb}>
                    {p.image ? <img src={p.image} alt={p.name} /> : <span>📦</span>}
                  </div>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{p.name}</span>
                    <span className={styles.productDesc}>
                      {p.description.slice(0, 55)}{p.description.length > 55 ? '…' : ''}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                {p.category ? (
                  <span className={styles.categoryTag}>{p.category.content}</span>
                ) : (
                  <span className={styles.cellMuted}>—</span>
                )}
              </td>
              <td>
                <strong className={styles.priceCell}>${Number(p.price).toFixed(2)}</strong>
              </td>
              <td>
                <StockBadge quantity={p.quantity} />
              </td>
              <td>
                <span className={`${styles.statusPill} ${p.status ? styles.pillActive : styles.pillInactive}`}>
                  {p.status  ? '● Active' : '○ Inactive'}
                </span>
              </td>
              <td className={styles.cellMuted}>
                {new Date(p.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </td>
              <td>
                <div className={styles.actionBtns}>
                  <button className={styles.editBtn} onClick={() => onEdit(p)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => onDelete(p)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
// ─── Grid View ────────────────────────────────────────────────────────────────
 
function GridView({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  return (
    <div className={styles.cardGrid}>
      {products.map((p) => (
        <div key={p.id} className={styles.productCard}>
          <div className={styles.cardImageWrap}>
            {p.image ? (
              <img src={p.image} alt={p.name} className={styles.cardImage} />
            ) : (
              <div className={styles.cardImagePlaceholder}>📦</div>
            )}
            <span className={`${styles.cardStatusBadge} ${p.status  ? styles.cardBadgeActive : styles.cardBadgeInactive}`}>
              {p.status}
            </span>
          </div>
          <div className={styles.cardBody}>
            {p.category && (
              <span className={styles.cardCategory}>{p.category.content}</span>
            )}
            <h3 className={styles.cardName}>{p.name}</h3>
            <p className={styles.cardDesc}>
              {p.description.slice(0, 80)}{p.description.length > 80 ? '…' : ''}
            </p>
            <div className={styles.cardMeta}>
              <span className={styles.cardPrice}>${p.price.toFixed(2)}</span>
              <StockBadge quantity={p.quantity} />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <button className={styles.editBtn} onClick={() => onEdit(p)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => onDelete(p)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
 
// ─── Stock Badge ──────────────────────────────────────────────────────────────
 
function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) return <span className={styles.stockOut}>Out of stock</span>;
  if (quantity <= 5)  return <span className={styles.stockLow}>{quantity} left</span>;
  return <span className={styles.stockOk}>{quantity}</span>;
}
 
// ─── Product Modal ────────────────────────────────────────────────────────────
 
function ProductModal({
  mode,
  product,
  categories,
  onClose,
}: {
  mode: ModalMode;
  product?: Product;
  categories: { id: string; content: string }[];
  onClose: () => void;
}) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage   = useUploadProductImage();
  const fileRef = useRef<HTMLInputElement>(null);
 
  const [form, setForm] = useState<CreateProductPayload>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category_id: product.category_id,
          status: product.status,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductPayload, string>>>({});
  const [apiError, setApiError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image ?? null);
 
  const set = <K extends keyof CreateProductPayload>(key: K, val: CreateProductPayload[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
 
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
 
  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim())    errs.name = 'Name is required';
    if (!form.category_id)    errs.category_id = 'Category is required';
    if (form.price < 0)       errs.price = 'Price must be 0 or more';
    if (form.quantity < 0)    errs.quantity = 'Quantity must be 0 or more';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
 
    try {
      if (mode === 'create') {
        const res = await createProduct.mutateAsync(form);
        if (imageFile && res.data?.id) {
          await uploadImage.mutateAsync({ id: res.data.id, file: imageFile });
        }
      } else if (product) {
        await updateProduct.mutateAsync({ id: product.id, payload: form });
        if (imageFile) {
          await uploadImage.mutateAsync({ id: product.id, file: imageFile });
        }
      }
      onClose();
    } catch (err: any) {
      setApiError(err?.message || 'Something went wrong. Please try again.');
    }
  };
 
  const isPending = createProduct.isPending || updateProduct.isPending || uploadImage.isPending;
 
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHead}>
          <div>
            <h2 className={styles.modalTitle}>
              {mode === 'create' ? 'New product' : 'Edit product'}
            </h2>
            <p className={styles.modalSubtitle}>
              {mode === 'create' ? 'Fill in the details below to create a new product' : `Editing: ${product?.name}`}
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
 
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Image upload */}
            <div className={styles.imageSection}>
              <label className={styles.label}>Product image</label>
              <div
                className={`${styles.imageUploadArea} ${imagePreview ? styles.imageUploadAreaFilled : ''}`}
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                    <div className={styles.imageOverlay}>
                      <span>Change image</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.imagePlaceholderIcon}>📷</span>
                    <span className={styles.imagePlaceholderText}>Click to upload</span>
                    <span className={styles.imagePlaceholderSub}>PNG, JPG, WebP up to 10MB</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImagePick}
                />
              </div>
            </div>
 
            {/* API error */}
            {apiError && <div className={styles.errorBanner}>{apiError}</div>}
 
            {/* Form fields */}
            <div className={styles.formGrid}>
              {/* Name - full width */}
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Product name *</label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                />
                {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
              </div>
 
              {/* Category */}
              <div className={styles.field}>
                <label className={styles.label}>Category *</label>
                <select
                  className={`${styles.input} ${errors.category_id ? styles.inputError : ''}`}
                  value={form.category_id}
                  onChange={(e) => set('category_id', e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.content}</option>
                  ))}
                </select>
                {errors.category_id && <span className={styles.fieldError}>{errors.category_id}</span>}
              </div>
 
              {/* Status */}
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  value={String(form.status)}
                  onChange={(e) => set('status', e.target.value==="true")}
                >
                  <option value="true">Active — visible to customers</option>
                  <option value="false">Inactive — hidden from store</option>
                </select>
              </div>
 
              {/* Price */}
              <div className={styles.field}>
                <label className={styles.label}>Price (USD) *</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${styles.input} ${styles.inputPrefixed} ${errors.price ? styles.inputError : ''}`}
                    value={form.price}
                    onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                {errors.price && <span className={styles.fieldError}>{errors.price}</span>}
              </div>
 
              {/* Quantity */}
              <div className={styles.field}>
                <label className={styles.label}>Stock quantity *</label>
                <input
                  type="number"
                  min="0"
                  className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
                  value={form.quantity}
                  onChange={(e) => set('quantity', parseInt(e.target.value) || 0)}
                />
                {errors.quantity && <span className={styles.fieldError}>{errors.quantity}</span>}
              </div>
 
              {/* Description - full width */}
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product — features, materials, dimensions…"
                />
              </div>
            </div>
          </div>
 
          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? (
                <><span className={styles.spinner} /> Saving…</>
              ) : mode === 'create' ? (
                'Create product'
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}