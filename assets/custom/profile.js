let userId = localStorage.getItem('User_id');
let User_role = localStorage.getItem('User_role')
if (User_role == 'Employee') {
    let profile = document.getElementById('profile');
    if (profile) {
        let profilePage = profile.getAttribute('href');
        if (profilePage == 'profile.html') {
            profile.setAttribute('href', 'userP.html');
        } else {
            console.log('Href is not found');
        }
    } else {
        console.log('Profile element not found');
    }
} else if (User_role == 'Admin') { // Use 'else if' with a space
    let profile = document.getElementById('profile');
    if (profile) {
        let profilePage = profile.getAttribute('href');
        if (profilePage == 'profile.html') {
            profile.setAttribute('href', 'profile.html');
        } else {
            console.log('Href is not found');
        }
    } else {
        console.log('Profile element not found');
    }
} else {
    console.log('User Role is not found');
}
