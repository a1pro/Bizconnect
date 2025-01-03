export const base_url= ' https://bizconnect.a1professionals.net/api/v1/'

export const Base_url = {

    login:`${base_url}auth/login/otp`,
    sociallogin:`${base_url}auth/sociallogin`,
    otplogin:`${base_url}auth/verify/otp/login`,
    addreviews:`${base_url}add/reviews`,
    getreviews:`${base_url}get/reviews`,
    updateProfile:`${base_url}users/update/profile`,
    profilepic:`${base_url}users/upload/profilepic`,
    profileData:`${base_url}users/profile/detail`,
    getContent:`${base_url}getpage/content`,
    addinvoice:`${base_url}add/invoice`,
    getInvoice:`${base_url}get/invoice`,
    createTicket:`${base_url}app/createticket`,
    tickets:`${base_url}app/tickets`,
    getUser:`${base_url}app/getusers`,
    userSearch:`${base_url}get/search/users`,
    twiliotoken:`${base_url}generate-twilio-video-token`
}