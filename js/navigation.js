document.addEventListener('DOMContentLoaded', () => {
    const navHTML = `
        <div class="container">
            <h1>JL Custom Home Plans</h1>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">House Plans &#9662;</a>
                    <div class="dropdown-content">
                        <a href="house-plan-barton.html">The Barton Plan</a>
                        <a href="house-plan-brown.html">The Brown Plan</a>
                        <a href="house-plan-stanton.html">The Stanton Plan</a>
                    </div>
                </li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact Us</a></li>
            </ul>
        </div>
    `;
    document.querySelector('header nav').innerHTML = navHTML;
});
