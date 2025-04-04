import PrivateAdminRoute from "@/routes/PrivateAdminRoute";
import RootAdmin from "@/layouts/root/RootAdmin";
import Dashboard from "@/pages/admin/Dashboard";
import ListUsers from "@/components/admin/AdminUser/ListUsers";
import BranchAdmins from "@/pages/admin/BranchAdmins";
import Branch from "@/pages/admin/Branch";
import Movie from "@/pages/admin/Movie";
import AddMovies from "@/components/admin/AdminMovie/AddMovies";
import EditMovies from "@/components/admin/AdminMovie/EditMovies";
import EditBranch from "@/components/Admin/AdminBranches/editBranch";
import AddBranch from "@/components/Admin/AdminBranches/AddBranch";
import ListCinemas from "@/components/Admin/AdminCinemas/ListCinemas";
import AddCinemas from "@/components/Admin/AdminCinemas/AddCinemas";
import EditCinemas from "@/components/Admin/AdminCinemas/EditCinemas";
import Genre from "@/pages/admin/Genre";
import MovieDetail from "@/components/Admin/AdminMovie/MovieDetail";
import Actors from "@/pages/admin/Actors";
import AddActor from "@/components/Admin/AdminActor/AddActor";
import EditActor from "@/components/Admin/AdminActor/EditActor";
import AddDirector from "@/components/Admin/AdminDirectors/AddDirector";
import ListDirector from "@/components/Admin/AdminDirectors/ListDirector";
import EditDerector from "@/components/Admin/AdminDirectors/EditDerector";
import Directors from "@/pages/admin/Directors";
import Producers from "@/pages/admin/Producers";
import EditProducer from "@/components/Admin/AdminProducer/EditProducer";
import ListProducer from "@/components/Admin/AdminProducer/ListProducer";
import AddProducer from "@/components/Admin/AdminProducer/AddProducer";
import AddRoom from "@/components/admin/AdminRoom/AddRoom";
import Room from "@/pages/admin/Room";
import EditRoom from "@/components/admin/AdminRoom/EditRooms";
import AddFoodAndDrinkForm from "@/components/admin/AdminFoodAndDrink/AddFoodAndDrink";
import FoodAndDrink from "@/pages/admin/FoodAndDrink";
import EditFoodAndDrink from "@/components/admin/AdminFoodAndDrink/EditFoodAndDrink";
import Combo from "@/pages/admin/Combo";
import AddCombo from "@/components/admin/AdminCombo/AddCombo";
import EditCombo from "@/components/admin/AdminCombo/EditCombo";
import ComboItem from "@/pages/admin/ComboItem";
import SeatType from "@/pages/admin/SeatType";
import ChatHistoryPage from "@/pages/admin/ChatHistoryPage";

import Showtime from "@/pages/admin/Showtime";
import Promotion from "../pages/admin/promotion/Promotion";
import AddShowtime from "@/components/admin/AdminShowtime/AddShowtime";
import SettingsPage from "@/pages/admin/SettingPage";
import AddPriceSetting from "@/components/admin/AdminSetting/AddPriceSetting";
import AddPromotion from "../pages/admin/promotion/AddPromotion";

import Posts from "@/pages/admin/Posts";
import PostsCreate from "@/pages/admin/PostsCreate";
import PostsEdit from "@/pages/admin/PostsEdit";


const AdminRoutes = {
  path: "/admin",
  // element: <RootAdmin />,
  element: <PrivateAdminRoute element={<RootAdmin />} requiredRole={["admin", "branch_admin"]} />,
  children: [
    { path: "", element: <Dashboard /> },
    { path: "users", element: <ListUsers /> },
    { path: "branch-admins", element: <BranchAdmins /> },
    { path: "branches", element: <Branch /> },
    { path: "movies", element: <Movie /> },
    { path: "movies/add", element: <AddMovies /> },
    { path: "movies/edit/:id", element: <EditMovies /> },
    { path: "movies/:id", element: <MovieDetail /> },
    { path: "editBranch/:id", element: <EditBranch /> },
    { path: "branches/add-branch", element: <AddBranch /> },
    { path: "cinemas", element: <ListCinemas /> },
    { path: "addcinemas", element: <AddCinemas /> },
    { path: "editcinemas", element: <EditCinemas /> },
    { path: "genre", element: <Genre /> },
    { path: "actors", element: <Actors /> },
    { path: "addactors", element: <AddActor /> },
    { path: "editActor/:id", element: <EditActor /> },
    { path: "directors", element: <Directors /> },
    { path: "addDirector", element: <AddDirector /> },
    { path: "ListDirector", element: <ListDirector /> },
    { path: "EditDirector/:id", element: <EditDerector /> },
    { path: "directors", element: <Directors /> },
    { path: "producers", element: <Producers /> },
    { path: "EditProducer/:id", element: <EditProducer /> },
    { path: "listproducer", element: <ListProducer /> },
    { path: "AddProducer", element: <AddProducer /> },
    { path: "rooms", element: <Room /> },
    { path: "rooms/add-room", element: <AddRoom /> },
    { path: "rooms/:id", element: <EditRoom /> },
    { path: "food&drink", element: <FoodAndDrink /> },
    { path: "addfood&drink", element: <AddFoodAndDrinkForm /> },
    { path: "editfood&drink", element: <EditFoodAndDrink /> },
    { path: "combo", element: <Combo /> },
    { path: "addcombo", element: <AddCombo /> },
    { path: "editcombo", element: <EditCombo /> },
    { path: "comboitem", element: <ComboItem /> },
    { path: "seat-types", element: <SeatType /> },
    
   
    { path: "showtimes", element: <Showtime /> },
    { path: "promotions", element: <Promotion /> },
    { path: "promotions/create", element: <AddPromotion /> },
    { path: "showtimes/create", element: <AddShowtime /> },
    { path: "setting", element: <SettingsPage /> },
    { path: "setting/price", element: <AddPriceSetting /> },
  
    
    { path: "branch", element: <Branch /> },
   
    { path: "chat-history", element: <ChatHistoryPage /> },
    { path: "showtime", element: <Showtime /> },
    { path: "showtime/add", element: <AddShowtime /> },
    { path: "promotions", element: <Promotion /> },
    { path: "settings", element: <SettingsPage /> },
    { path: "settings/price", element: <AddPriceSetting /> },
    { path: "posts", element: <Posts /> },
    { path: "posts/create", element: <PostsCreate /> },
    { path: "posts/edit/:id", element: <PostsEdit /> },
  ],
};

export default AdminRoutes;
