const addPostForm = document.getElementById("addPostForm");
const addCommentForm = document.getElementById("addCommentForm");
const commentsList = document.getElementById("commentsList");


const postsList = document.getElementById("postsList");
const postIdInput = document.getElementById("postIdInput");
const postDisplay = document.getElementById("postDisplay");

const url = "http://localhost:3000";


// استرجاع عناوين المنشورات
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((post) => {
      const listItem = document.createElement("li");
      listItem.textContent = post.title;
      listItem.onclick = () => getPostContent(post.post_id);
      postsList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// استرجاع المنشور بناءً على الـ ID المدخل
function getPost() {
  const postId = postIdInput.value;
  fetch(`${url}/post/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      postDisplay.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
    })
    .catch((error) => console.error("Error fetching post:", error));
}


function getPostContent(postId) {
  fetch(`${url}/post/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      const postDisplay = document.getElementById("postDisplay");
      postDisplay.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
    })
    .catch((error) => console.error("Error fetching post:", error));
}



addPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;



  fetch("/add-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => response.text())
  .then(message => {
    if(message === "New post added successfully!"){
      alert("Okyy!! " + message);
      location.reload(); // اعادة تحميل الصفحة بعد الاضافة الناجحة للمنشور
    }else{
      alert("Error: " + message);
      console.log("Error: " + message);
    }
  })
  .catch(error => console.error(" Errrorr: "+ error));
});


addCommentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const postId = document.getElementById("postId").value;
  const commentText = document.getElementById("commentContent").value;

  fetch(`/add-comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ commentText })
  })
  .then(response => response.text())
  .then(message => alert(message))
  .catch(error => console.error(error));
});

function getComments() {
  const postId = document.getElementById("commentsPostId").value;
  
  fetch(`/comments/${postId}`)
  .then(response => response.json())
  .then(comments => {
    commentsList.innerHTML = "";
    comments.forEach(comment => {
      const li = document.createElement("li");
      li.textContent = comment.comment_text;
      commentsList.appendChild(li);
    });
  })
  .catch(error => console.error(error));
}
