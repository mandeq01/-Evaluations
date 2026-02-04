document.addEventListener("DOMContentLoaded", function(){

// ----- SIGNUP -----
let signupForm = document.getElementById("signupForm");
if(signupForm){
    signupForm.addEventListener("submit", function(e){
        e.preventDefault();
        let name = document.getElementById("signup-name").value.trim();
        let email = document.getElementById("signup-email").value.trim();
        let pass = document.getElementById("signup-password").value;
        let pass2 = document.getElementById("signup-password2").value;
        let msg = document.getElementById("signup-message");

        if(/\d/.test(name)){
            msg.textContent="Name cannot contain numbers!";
            msg.style.color="red";
            return;
        }
        if(pass.length<6){
            msg.textContent="Password must be at least 6 characters!";
            msg.style.color="red";
            return;
        }
        if(pass!==pass2){
            msg.textContent="Passwords do not match!";
            msg.style.color="red";
            return;
        }

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPass", pass);
        msg.style.color="green";
        msg.textContent="Signup successful! You can now login.";
        signupForm.reset();
    });
}

// ----- LOGIN -----
let loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        let email = document.getElementById("login-email").value.trim();
        let pass = document.getElementById("login-password").value;
        let msg = document.getElementById("login-message");
        let storedEmail = localStorage.getItem("userEmail");
        let storedPass = localStorage.getItem("userPass");

        if(email===storedEmail && pass===storedPass){
            localStorage.setItem("loggedInUser", email);
            msg.style.color="green";
            msg.textContent="Login successful!";
            loginForm.reset();
            // Reload page to unlock evaluation
            setTimeout(function(){ location.reload(); }, 500);
        } else {
            msg.style.color="red";
            msg.textContent="Invalid email or password!";
        }
    });
}

// ----- EVALUATION PAGE ACCESS -----
let evalContainer = document.getElementById("evaluation-container");
let loginWarning = document.getElementById("login-warning");
let hospitalSelect = document.getElementById("hospital");

if(evalContainer){
    let loggedIn = localStorage.getItem("loggedInUser");

    if(!loggedIn){
        evalContainer.style.display = "none";
        loginWarning.style.display = "block";
        loginWarning.textContent = "⚠️ You must login to evaluate hospitals!";
        loginWarning.style.color = "red";
        loginWarning.style.fontWeight = "bold";

        if(hospitalSelect){ hospitalSelect.disabled = true; }
    } else {
        evalContainer.style.display = "block";
        loginWarning.style.display = "none";
        if(hospitalSelect){ hospitalSelect.disabled = false; }
    }

    // ----- STAR RATING -----
    let ratings = {};
    let ratingDivs = document.querySelectorAll(".rating");
    ratingDivs.forEach(function(div){
        let stars = div.querySelectorAll("span");
        stars.forEach(function(star,i){
            star.addEventListener("mouseover", function(){
                stars.forEach(function(s,j){ s.classList.toggle("hover", j<=i); });
            });
            star.addEventListener("mouseout", function(){
                stars.forEach(function(s){ s.classList.remove("hover"); });
            });
            star.addEventListener("click", function(){
                stars.forEach(function(s,j){ s.classList.toggle("selected", j<=i); });
                ratings[div.dataset.aspect] = i+1;
            });
        });
    });

    // ----- SUBMIT EVALUATION -----
    let evalForm = document.getElementById("evaluationForm");
    evalForm.addEventListener("submit", function(e){
        e.preventDefault();
        let hospital = hospitalSelect.value;
        if(!hospital){
            alert("Please select a hospital!");
            return;
        }

        let aspects = ["doctor","waiting","cleanliness","treatment","staff"];
        for(let a of aspects){
            if(!ratings[a]){
                alert("Please rate "+a);
                return;
            }
        }

        // Save stats
        let total = parseInt(localStorage.getItem("totalEvals")||"0")+1;
        localStorage.setItem("totalEvals", total);
        localStorage.setItem("lastHospital", hospital);

        let sum=0;
        for(let a of aspects){ sum+=ratings[a]; }
        let avg = (sum/aspects.length).toFixed(1);
        localStorage.setItem(hospital+"Avg", avg);

        // Update display
        document.getElementById("total-evals").textContent=total;
        document.getElementById("last-hospital").textContent=hospital;
        document.getElementById("avg-rating").textContent=avg;

        alert("Evaluation submitted successfully!");
        evalForm.reset();
        ratingDivs.forEach(function(div){
            div.querySelectorAll("span").forEach(function(s){ s.classList.remove("selected"); });
        });
        ratings={};
    });

    // ----- RESET EVALUATION -----
    document.getElementById("reset-eval").addEventListener("click", function(){
        evalForm.reset();
        ratingDivs.forEach(function(div){
            div.querySelectorAll("span").forEach(function(s){ s.classList.remove("selected"); });
        });
        ratings={};
    });
}

// ----- CONTACT FORM -----
let contactForm = document.getElementById("contactForm");
if(contactForm){
    contactForm.addEventListener("submit", function(e){
        e.preventDefault();
        let name = document.getElementById("contact-name").value.trim();
        let email = document.getElementById("contact-email").value.trim();
        let msg = document.getElementById("contact-message").value.trim();
        let feedback = document.getElementById("contact-feedback");

        if(/\d/.test(name)){
            feedback.textContent = "Name cannot contain numbers!";
            feedback.style.color="red";
            return;
        }
        if(email==="" || msg===""){
            feedback.textContent = "Email and message are required!";
            feedback.style.color="red";
            return;
        }

        feedback.textContent = "Message sent successfully!";
        feedback.style.color="green";
        contactForm.reset();
    });
});