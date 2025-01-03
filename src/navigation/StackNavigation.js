import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SplashScreen from "../screens/SplachScreen.";
import Login from "../screens/Login";
import BottomTabNavigation from "./BottomTabNavigation";
import ChatScreen from "../screens/ChatScreen";
import Invoices from "../screens/Invoices";
import AddInvoices from "../screens/AddInvoices";
import AddReviews from "../screens/AddReviews";
import ChatInbox from "../screens/ChatInbox";
import VideoCallScreen from "../screens/VideoCallScreen";
import OtpScreen from "../OtpScreen";
import Reviews from "../screens/Reviews";
import Settings from "../screens/Settings";
import ProfileScreen from "../screens/ProfileScreen";
import Insights from "../screens/Insights/Insights";
import CompletedReviews from "../screens/CompletedReviews";
import CreateTicket from "../screens/Ticket/CreateTicket";
import Tickets from "../screens/Ticket/Tickets";
import Building from "../screens/Buildings";
import AudioCallScreen from "../screens/AudioCallScreen";


const Stack = createNativeStackNavigator();

const StackNavigation=()=>{
    return(
        <Stack.Navigator>
            <Stack.Screen name="SplachScreen" component={SplashScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Chat" component={ChatInbox} options={{headerShown:false}}/>
            <Stack.Screen name="Home" component={BottomTabNavigation} options={{headerShown:false}}/>
            <Stack.Screen name="Invoices" component={Invoices} options={{headerShown:false}}/>
            <Stack.Screen name="AddInvoices" component={AddInvoices} options={{headerShown:false}}/>
            <Stack.Screen name="AddReviews" component={AddReviews} options={{headerShown:false}}/>
            <Stack.Screen name="Review" component={Reviews} options={{headerShown:false}}/>
            <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{headerShown:false}}/>
            <Stack.Screen name="AudioCallScreen" component={AudioCallScreen} options={{headerShown:false}}/>
            <Stack.Screen name="OtpScreen" component={OtpScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Setting" component={Settings} options={{headerShown:false}}/>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Insights" component={Insights} options={{headerShown:false}}/>
            <Stack.Screen name="CreateTicket" component={CreateTicket} options={{headerShown:false}}/>
            <Stack.Screen name="Tickets" component={Tickets} options={{headerShown:false}}/>
            <Stack.Screen name="Buildings" component={Building} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}
export default StackNavigation;