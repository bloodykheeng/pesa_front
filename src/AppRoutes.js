import React, { lazy, Suspense, useState } from "react";

//==================== my car routes ====================
import NewUsersPage from "./views/users/UserPage";
import ProductCategoriesPage from "./views/product-categories/ProductCategoriesPage";
import ProductCategoryViewPage from "./views/product-categories/ProductCategoryViewPage";
import ProductCategoryBrandsViewPage from "./views/product-category-brands/ProductCategoryBrandsViewPage";

import ProductTypesPage from "./views/product-types/ProductTypesPage.jsx";
import PackagesPage from "./views/packages/PackagesPage.jsx";
import OrdersPage from "./views/orders/OrdersPage.jsx";
import OrdersViewPage from "./views/orders/OrdersViewPage.jsx";
import CustomersPage from "./views/customers/UserPage";
import CustomersViewPage from "./views/customers/UsersViewPage";

// ============ Customm component routes ========================
const DashboardPage = lazy(() => import("./components/Dashboard"));
const FormLayoutDemo = lazy(() => import("./components/FormLayoutDemo"));
const InputDemo = lazy(() => import("./components/InputDemo"));
const FloatLabelDemo = lazy(() => import("./components/FloatLabelDemo"));
const InvalidStateDemo = lazy(() => import("./components/InvalidStateDemo"));
const ButtonDemo = lazy(() => import("./components/ButtonDemo"));
const TableDemo = lazy(() => import("./components/TableDemo"));
const ListDemo = lazy(() => import("./components/ListDemo"));
const TreeDemo = lazy(() => import("./components/TreeDemo"));
const PanelDemo = lazy(() => import("./components/PanelDemo"));
const OverlayDemo = lazy(() => import("./components/OverlayDemo"));
const MediaDemo = lazy(() => import("./components/MediaDemo"));
const MenuDemo = lazy(() => import("./components/MenuDemo"));
const MessagesDemo = lazy(() => import("./components/MessagesDemo"));
const FileDemo = lazy(() => import("./components/FileDemo"));
const ChartDemo = lazy(() => import("./components/ChartDemo"));
const MiscDemo = lazy(() => import("./components/MiscDemo"));
const Crud = lazy(() => import("./pages/Crud"));
const EmptyPage = lazy(() => import("./pages/EmptyPage"));
const TimelineDemo = lazy(() => import("./pages/TimelineDemo"));

function AppRoutes() {
    const privateDefaultRoutes = [
        {
            path: "/dashboard",
            name: "dashboard",
            element: DashboardPage, // Replace with the actual component
            layout: "/private",
        },
        {
            path: "/formlayout",
            name: "formlayout",
            element: FormLayoutDemo,
            layout: "/private",
        },
        {
            path: "/input",
            name: "input",
            element: InputDemo,
            layout: "/private",
        },
        {
            path: "/floatlabel",
            name: "floatlabel",
            element: FloatLabelDemo,
            layout: "/private",
        },
        {
            path: "/invalidstate",
            name: "invalidstate",
            element: InvalidStateDemo,
            layout: "/private",
        },
        {
            path: "/button",
            name: "button",
            element: ButtonDemo,
            layout: "/private",
        },
        {
            path: "/table",
            name: "table",
            element: TableDemo,
            layout: "/private",
        },
        {
            path: "/list",
            name: "list",
            element: ListDemo,
            layout: "/private",
        },
        {
            path: "/tree",
            name: "tree",
            element: TreeDemo,
            layout: "/private",
        },
        {
            path: "/panel",
            name: "panel",
            element: PanelDemo,
            layout: "/private",
        },
        {
            path: "/overlay",
            name: "overlay",
            element: OverlayDemo,
            layout: "/private",
        },
        {
            path: "/media",
            name: "media",
            element: MediaDemo,
            layout: "/private",
        },
        {
            path: "/menu",
            name: "menu",
            element: MenuDemo,
            layout: "/private",
        },
        {
            path: "/messages",
            name: "messages",
            element: MessagesDemo,
            layout: "/private",
        },
        {
            path: "/file",
            name: "file",
            element: FileDemo,
            layout: "/private",
        },
        {
            path: "/chart",
            name: "chart",
            element: ChartDemo,
            layout: "/private",
        },
        {
            path: "/misc",
            name: "misc",
            element: MiscDemo,
            layout: "/private",
        },
        {
            path: "/timeline",
            name: "timeline",
            element: TimelineDemo,
            layout: "/private",
        },
        {
            path: "/crud",
            name: "crud",
            element: Crud,
            layout: "/private",
        },
        {
            path: "/empty",
            name: "empty",
            element: EmptyPage,
            layout: "/private",
        },

        // ============================= Pesa Routes ==================================

        {
            path: "/users",
            name: "users",
            element: NewUsersPage,
            layout: "/admin",
        },
        {
            path: "/product-categories",
            name: "product-categories",
            element: ProductCategoriesPage,
            layout: "/admin",
        },
        {
            path: "/product-categories/category",
            name: "category",
            element: ProductCategoryViewPage,
            layout: "/admin",
        },

        {
            path: "/product-categories/category/brand",
            name: "product-category-brand",
            element: ProductCategoryBrandsViewPage,
            layout: "/admin",
        },

        {
            path: "/product-types",
            name: "ProductTypesPage",
            element: ProductTypesPage,
            layout: "/admin",
        },
        {
            path: "/orders",
            name: "ProductTypesPage",
            element: OrdersPage,
            layout: "/admin",
        },

        {
            path: "/orders",
            name: "ProductTypesPage",
            element: OrdersPage,
            layout: "/admin",
        },

        {
            path: "/orders/order",
            name: "OrdersViewPage",
            element: OrdersViewPage,
            layout: "/admin",
        },

        {
            path: "/packages",
            name: "packages",
            element: PackagesPage,
            layout: "/admin",
        },
        {
            path: "/customers",
            name: "customers",
            element: CustomersPage,
            layout: "/admin",
        },
        {
            path: "/customers/customer",
            name: "customer",
            element: CustomersViewPage,
            layout: "/admin",
        },
        {
            path: "/customers/customer/order",
            name: "OrdersViewPage",
            element: OrdersViewPage,
            layout: "/admin",
        },
    ];

    const [privateRoutes, setPrivateRoutes] = useState(privateDefaultRoutes);

    return privateRoutes;
}

export default AppRoutes;
