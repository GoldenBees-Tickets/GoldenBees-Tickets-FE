import RootUser from "@/layouts/root/RootUser";
import HomePage from "@/pages/user/HomePage";
import Profile from "@/pages/user/Profile";
import About from "@/pages/user/About";
import Contacts from "@/pages/user/Contacts";
import Blog from "@/pages/user/Blog";
import Product from "@/pages/user/Product";
import Detail from "@/pages/user/Detail";
import ListChair from "@/pages/user/ListChair";
import FilterHome from "@/pages/user/FilterHome";
import HomePay from "@/pages/user/HomePay";
import Actor from "@/pages/user/Actor";
import Producer from "@/pages/user/Producer";
import Director from "../pages/user/Director";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentResult from "../pages/Payment/PaymentResult";
import Booking from "@/pages/user/Booking";
import Payment from "@/pages/user/Payment";
import PaymentSuccess from "@/pages/user/PaymentSuccess";
import TestVNPay from "../pages/Payment/TestVNPay";
import VNPayResult from "../pages/Payment/VNPayResult";
import VNPaySuccess from "../pages/Payment/VNPaySuccess";
import VoiceConverterPage from "../pages/VoiceConverter/VoiceConverterPage";
import PostDetail from "@/pages/user/PostDetail";
import TicketPurchasePage from "@/pages/user/TicketPurchasePage";


const UserRoutes = {
  path: "/",
  element: <RootUser />,
  children: [
    { path: "", element: <HomePage /> },
    { path: "account", element: <Profile /> },
    { path: "about", element: <About /> },
    { path: "contact", element: <Contacts /> },
    { path: "blog", element: <Blog /> },
    { path: "blog/:id", element: <PostDetail /> },
    { path: "movies", element: <Product /> },
    { path: "detail/:id", element: <Detail /> },
    { path: "chair", element: <ListChair /> },
    { path: "filterhome", element: <FilterHome /> },
    { path: "homepay", element: <HomePay /> },
    { path: "actor/:id", element: <Actor /> },
    { path: "producer/:id", element: <Producer /> },
    { path: "director/:id", element: <Director /> },
    { path: "/payment", element: <PaymentPage /> },
    { path: "/payment-result", element: <PaymentResult /> },
    { path: "/booking/:showtime_id", element: <Booking /> },
    { path: "/payment/:showtime_id", element: <Payment /> },
    { path: "/payment-success", element: <PaymentSuccess /> },
    // VNPay Test Routes
    { path: "/test-vnpay", element: <TestVNPay /> },
    { path: "/vnpay-result", element: <VNPayResult /> },
    { path: "/vnpay-success", element: <VNPaySuccess /> },
    { path: "/voice-converter", element: <VoiceConverterPage /> },
    { path: "/ticket-purchase", element: <TicketPurchasePage /> }
  ]
};

export default UserRoutes;
