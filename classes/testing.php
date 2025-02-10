
<script> User = <?php include('users.js') ;?>// Adjust the path if necessary

async function testFetchUserDetails() {
    try {
        const userId = 1; // replace with the user ID you want to test
        const user = await User.fetchUserDetails(userId);
        console.log(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

testFetchUserDetails();
</script>
