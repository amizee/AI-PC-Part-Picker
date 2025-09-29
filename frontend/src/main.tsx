import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AIChat from "./pages/AIChat.tsx"
import Profile from "./pages/Profile.tsx"
import SavedParts from "./components/Profile/SavedParts.tsx"
import SavedBuilds from "./components/Profile/SavedBuilds.tsx"
import AdCopies from "./components/Profile/AdCopies.tsx"
import CreateAccount from "./pages/CreateAccount.tsx"
import SearchPartsPage from "./pages/SearchPartsPage.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./api/Query.ts"

import PCPartDetail from "./pages/PCPartDetail.tsx";
import Login from "./pages/LoginPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx"
import GenerateAdCopyPage from "./pages/GenerateAdCopyPage.tsx"

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/chat",
        element: <AIChat />,
      },
      {
        path: "/profile",
        children: [
          {
            path: "account",
            element: <Profile />,
          },
          {
            path: "saved-parts",
            element: <SavedParts />,
          },
          {
            path: "saved-builds",
            element: <SavedBuilds />,
          },
          {
            path: "ad-copies",
            element: <AdCopies />,
          },
        ],
      },
      {
        path: "/search-parts",
        element: <SearchPartsPage />
      },
      {
        path:"/pcparts/:id",
        element: <PCPartDetail />
      },
      {
        path: "/advertising",
        element: <GenerateAdCopyPage />,
      }
    ],
  },

])

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>

  </StrictMode>
)
