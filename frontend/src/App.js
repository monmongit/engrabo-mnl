import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ProductDetailsPage,
  ProfilePage,
  AdminCreatePage,
  AdminActivationPage,
  AdminLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInboxPage,
} from './routes/Routes.js';
import {
  AdminHomePage,
  AdminDashboardPage,
  AdminCreateProduct,
  AdminAllProducts,
  AdminCreateEvents,
  AdminAllEvents,
  AdminAllCoupons,
  AdminPreviewPage,
  AdminAllCategories,
  AdminAllOrders,
  AdminOrdersDetails,
  AdminAllRefunds,
  AdminSettingsPage,
  AdminUpdatePasswordPage,
  AdminInboxPage,
} from './routes/AdminRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store.js';
import { loadAdmin, loadUser } from './redux/action/user';
import ProtectedRoute from './routes/ProductedRoute';
// import { AdminHomePage } from './AdminRoutes';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import { getAllProducts } from './redux/action/product.js';
import { getAllEvents } from './redux/action/event.js';

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadAdmin());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/admin/activation/:activation_token"
          element={<AdminActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInboxPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route path="/admin/preview/:id" element={<AdminPreviewPage />} />

        <Route path="/admin-create" element={<AdminCreatePage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        <Route
          path="/admin/:id"
          element={
            <AdminProtectedRoute>
              <AdminHomePage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-settings"
          element={
            <AdminProtectedRoute>
              <AdminUpdatePasswordPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <AdminProtectedRoute>
              <AdminSettingsPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-create-product"
          element={
            <AdminProtectedRoute>
              <AdminCreateProduct />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-products"
          element={
            <AdminProtectedRoute>
              <AdminAllProducts />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-orders"
          element={
            <AdminProtectedRoute>
              <AdminAllOrders />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <AdminProtectedRoute>
              <AdminOrdersDetails />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-categories"
          element={
            <AdminProtectedRoute>
              <AdminAllCategories />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-create-event"
          element={
            <AdminProtectedRoute>
              <AdminCreateEvents />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-events"
          element={
            <AdminProtectedRoute>
              <AdminAllEvents />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-coupons"
          element={
            <AdminProtectedRoute>
              <AdminAllCoupons />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-refunds"
          element={
            <AdminProtectedRoute>
              <AdminAllRefunds />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard-messages"
          element={
            <AdminProtectedRoute>
              <AdminInboxPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
