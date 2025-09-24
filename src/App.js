import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Campaign from "./pages/campaign/Campaign";
import New from "./pages/new/New";
import Volunteer from "./pages/volunteer/Volunteer";
import Single from "./pages/single/Single";
import Donors from "./pages/donators/Donators";
import CampaignAdd from "./pages/campaign_add/CampaignAdd";
import CampaignArchive from "./pages/campaign_archive/CampaignArchive";
import Campaign_details from "./pages/campaign_details/Campaign_details";
import VolunteerRequest from "./pages/volunteer_request/Volunteer_request";
import VolunteerRequestDetails from "./pages/volunteerRequestDetails/VolunteerRequestDetails";
import VolunteerRequestAdd from "./pages/volunteerRequestAdd/VolunteerRequestAdd"; 
import Recharge from "./pages/rechargeUserCard/Recharge";
import RechargeUsers from "./pages/recargingUsers/RechargeUsers";
import GuarnteesShow from "./pages/guarnteesShow/GuarnteesShow";
import GuarnteesDetails from "./pages/guarnteesDetails/GuarnteesDetails";
import GuarnteesAdd from "./pages/guarnteesAdd/GuarnteesAdd";
import Login1 from "./pages/login/Login1";
import Login2 from "./pages/login/Login2";
import Login3 from "./pages/login/Login3";
import GuarnteesArchive from "./pages/guarntesArchive/GuarnteesArchive";
import Emails from "./pages/emails/Emails";
import Reports from "./pages/reports/Reports";
import ReportsAdd from './pages/reportsAdd/ReportsAdd'
import CategoryAdd from "./pages/categoryAdd/CategoryAdd";
import CategoryShow from "./pages/categoryShow/CategoryShow";
import BeneficiaryRequest from "./pages/beneficiaryRequest/BeneficiaryRequest";
import Benefciaries from "./pages/beneficiaries/Benefciaries";
import BeneficiaryRequestDetails from "./pages/beneficiaryRequestDetails/BeneficiaryRequestDetails";
import BeneficiaryRequestAdd from "./pages/beneficiaryRequestAdd/BeneficiaryRequestAdd";
import BeneficiaryDetails from "./pages/beneficiaryDetails/BeneficiaryDetails";
import Boxes from "./pages/boxes/Boxes";
import BoxStat from "./pages/boxState/BoxStat";
import BoxDetails from "./pages/boxdetails/Boxdetails"; 
import BoxCampaignStat from "./pages/boxCampaignStat/BoxCampaignStat";
import Donations from "./pages/donations/Donations";
import Exchanges from "./pages/exchanges/Exchanges";
import CurrentDonations from "./pages/currentDonations/CurrentDonations";
import VolunteerDetails from "./pages/volunteer_details/Volunteer_details";
import HumanCaseDetails from "./pages/humanterian_cases_details/Humanterian_cases_details";
import HumanCases from "./pages/humaniterian_cases/Humaniterian_cases";
import CasesArchive from "./pages/humaniterian_cases_archive/Humaniterian_cases_archive";
import AddHumanCases from "./pages/humanterian_cases_request/Humanterian_cases_request";
import Inkind from "./pages/InKind/Inkind";
import Inkinddetails from "./pages/inkinddetails/Inkinddetails";

const router = createBrowserRouter([
  // الصفحات الرئيسية
  { path: "/", element: <Login1 /> },
  { path: "/forgot-password", element: <Login2 /> },
  { path: "/Login3", element: <Login3 /> },
  { path: "/home", element: <Home /> },
  { path: "/confirm", element: <Home /> },

  //Category
  { path: "/categoryAdd", element: <CategoryAdd /> },
  { path: "/categoryShow", element: <CategoryShow /> },

  // Campaign
  { path: "/campaign", element: <Campaign /> },
  { path: "/campaign/:id", element: <Single /> },
  { path: "/campaign/:id/new", element: <New /> },
  { path: "/campaign_add", element: <CampaignAdd /> },
  { path: "/campaignAdd/:id/new", element: <New /> },
  { path: "/campaign_archive", element: <CampaignArchive /> },
  { path: "/campaign_archive/:id", element: <CampaignArchive /> },
  { path: "/campaign_details/:id", element: <Campaign_details /> },

  // Donators
  { path: "/donators", element: <Donors /> },

  // Volunteer
  { path: "/volunteer", element: <Volunteer /> },
  { path: "/volunteer/:id", element: <New /> },
  { path: "/volunteer/:id/new", element: <New /> },
  { path: "/volunteerDetails/:id", element: <VolunteerDetails /> },

  // Volunteer Requests
  { path: "/volunteer_request", element: <VolunteerRequest /> },
  { path: "/volunteer-request/:id", element: <VolunteerRequestDetails /> },
  { path: "/volunteer-request/add", element: <VolunteerRequestAdd /> }, 

  //beneficiaries
  { path: "/beneficiaries", element: <Benefciaries /> },
  { path: "/beneficiaries/:id", element: <New /> },
  { path: "/beneficiaries/:id/new", element: <New /> },
  { path: "/beneficiaryDetails", element: <BeneficiaryDetails /> },
  { path: "/beneficiaryDetails/:id", element: <BeneficiaryDetails /> },

  //beneficiaryRequest
  { path: "/beneficiaryRequest", element: <BeneficiaryRequest /> },
  { path: "/beneficiaryRequestDetails/:id", element: <BeneficiaryRequestDetails /> },
  { path: "/beneficiary-request/add", element: <BeneficiaryRequestAdd /> }, 

  // Recharge
  { path: "/recharge", element: <Recharge /> },
  { path: "/recharge/:id", element: <New /> },
  { path: "/recargingUsers", element: <RechargeUsers /> },
  { path: "/recargingUsers/:id", element: <New /> },

   //Humanitarian Cases
  { path: "/HumanCases/", element: <HumanCases /> },
  { path: "/HumanCaseDetails/:id", element: <HumanCaseDetails /> },
  { path: "/AddHumanCases/", element: <AddHumanCases /> },
   { path: "/CasesArchive/", element: <CasesArchive /> },

  // Guarntees
  { path: "/guarnteesShow", element: <GuarnteesShow /> },
  { path: "/guarnteesDetails/:id", element: <GuarnteesDetails /> },
  { path: "/guarnteesAdd", element: <GuarnteesAdd /> },
  { path: "/guarnteesArchive", element: <GuarnteesArchive /> },
  
  // Boxes
  { path: "/boxes", element: <Boxes /> },
  { path: "/boxstate/:id", element: <BoxStat /> },
  { path: "/boxdetails", element: <BoxDetails /> }, 
  { path: "/boxCampaignStat/:id", element: <BoxCampaignStat /> },

  //donations and exchanges
  { path: "/donations", element: <Donations /> },
  { path: "/exchanges", element: <Exchanges /> } ,
  { path: "/currentDonations", element: <CurrentDonations /> } ,

  //inkind
  { path: "/inkind", element: <Inkind /> } ,
    { path: "/inkind/:id", element: <Inkinddetails /> },


  // Emails
  { path: "/emails", element: <Emails /> } ,
  
  // Reports
  { path: "/reports", element: <Reports /> },
  { path: "/reportsAdd", element: <ReportsAdd /> }
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
