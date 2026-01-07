import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";

import { createProduct, updateProduct } from "../services/products.api";
import {
  addProductToStore,
  updateProductInStore, // ✅ new
  getStoredCategories,
  normalizeCategory,
} from "../utils/productUtils";

import { ProductSchema } from "../schemas/product";
import { ROUTES } from "../routes/routes";

import "./Login.scss";

const ProductForm = ({ mode = "Add", initialValues, onDone }) => {
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    const stored = getStoredCategories();
    setCategories(stored);

    // If editing and category not in stored categories, switch to newCategory mode
    if (
      initialValues &&
      initialValues.category &&
      !stored.includes(initialValues.category)
    ) {
      setIsNewCategory(true);
    }
  }, [initialValues]);

  // Determine form initial values
  const defaultValues = {
    title: "",
    price: "",
    description: "",
    category: "",
    newCategory: "",
    image: "",
    ...initialValues,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError("");

      let finalCategory = "";

      if (isNewCategory) {
        if (!values.newCategory.trim()) {
          setError("New category is required");
          setSubmitting(false);
          return;
        }

        const normalizedNew = normalizeCategory(values.newCategory);
        const existingCategory = categories.find(
          (cat) => normalizeCategory(cat) === normalizedNew
        );

        finalCategory = existingCategory || values.newCategory.trim();

        // Add new category to state (and localStorage)
        if (!existingCategory) {
          setCategories((prev) => [...prev, finalCategory]);
          localStorage.setItem(
            "categories",
            JSON.stringify([...categories, finalCategory])
          );
        }
      } else {
        if (!values.category) {
          setError("Please select a category");
          setSubmitting(false);
          return;
        }
        finalCategory = values.category;
      }

      const productData = {
        ...values,
        price: Number(values.price),
        category: finalCategory,
        rating: {
          rate: values.rating?.rate || 0,
          count: values.rating?.count || 0,
        },
      };

      if (mode === "Add") {
        await createProduct(productData).catch(() => {});
        addProductToStore(productData); // updates localStorage
      } else if (mode === "Edit") {
        await updateProduct(productData.id, productData).catch(() => {});
        updateProductInStore(productData.id, productData); // ✅ update in localStorage
      }

      resetForm();
      if (onDone) onDone(); // close modal / trigger parent refresh
      else navigate(ROUTES.ADMIN);
    } catch (err) {
      console.error(err);
      setError(`${mode} failed`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <main className="login-main">
        <div className="login-container">
          <div className="auth-card">
            <h1 className="auth-title">{mode} Product</h1>
            <p className="auth-subtitle">
              {mode === "Add"
                ? "Create a new product"
                : "Update the product details"}
            </p>

            {error && <div className="auth-error">{error}</div>}

            <Formik
              initialValues={defaultValues}
              validationSchema={ProductSchema}
              validateOnBlur
              validateOnChange
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, isValid }) => (
                <Form className="auth-form">
                  {/* TITLE */}
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <Field name="title" className="form-input" />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  {/* PRICE */}
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <Field name="price" type="number" className="form-input" />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    {!isNewCategory ? (
                      <>
                        <Field
                          as="select"
                          name="category"
                          className="form-input"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Field>
                        <button
                          type="button"
                          className="auth-button"
                          style={{ marginTop: 8 }}
                          onClick={() => {
                            setIsNewCategory(true);
                            setFieldValue("category", "");
                          }}
                        >
                          + Add New Category
                        </button>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="form-error"
                        />
                      </>
                    ) : (
                      <>
                        <Field
                          name="newCategory"
                          className="form-input"
                          placeholder="Enter new category"
                        />
                        <button
                          type="button"
                          className="auth-button"
                          style={{ marginTop: 8 }}
                          onClick={() => {
                            setIsNewCategory(false);
                            setFieldValue("newCategory", "");
                          }}
                        >
                          Use Existing Category
                        </button>
                        <ErrorMessage
                          name="newCategory"
                          component="div"
                          className="form-error"
                        />
                      </>
                    )}
                  </div>

                  {/* IMAGE */}
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <Field name="image" className="form-input" />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="auth-button"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? `${mode}ing...` : `${mode} Product`}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductForm;
