
// Sidebar
const menuItems = document.querySelectorAll('.menu-item');

// Messages 
const messageNotification = document.querySelector('#messages-notifications');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');

//Theme
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSize = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');

// Theme Background Values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// Default theme settings (dark theme)
const defaultTheme = () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';
    changeBG(); // Apply default dark background
    Bg3.classList.add('active'); // Set Bg3 (dark) as active
};

// Load Theme from Local Storage or set default
window.addEventListener('load', () => {
    if (!localStorage.getItem('theme')) {
        defaultTheme(); // Apply default dark theme if no theme is saved
    } else {
        const savedTheme = localStorage.getItem('theme');
        applyTheme(savedTheme); // Apply the saved theme
    }
});

// Save Theme to Local Storage
const saveTheme = (theme) => {
    localStorage.setItem('theme', theme);
};

// Apply the theme based on the user's selection
const applyTheme = (theme) => {
    if (theme === 'bg-1') {
        window.location.reload();
    } else if (theme === 'bg-2') {
        darkColorLightness = '95%';
        whiteColorLightness = '20%';
        lightColorLightness = '15%';
    } else if (theme === 'bg-3') {
        darkColorLightness = '95%';
        whiteColorLightness = '10%';
        lightColorLightness = '0%';
    }
    changeBG();
};

// Changes background color based on selected theme
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
};

// Bg1, Bg2, Bg3 event listeners (theme switching)
Bg1.addEventListener('click', () => {
    Bg1.classList.add('active');
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    saveTheme('bg-1'); // Save selected theme
    window.location.reload(); // Reset to default
});

Bg2.addEventListener('click', () => {
    Bg2.classList.add('active');
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    saveTheme('bg-2');
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';
    changeBG();
});

Bg3.addEventListener('click', () => {
    Bg3.classList.add('active');
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    saveTheme('bg-3');
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';
    changeBG();
});

// ============== OTHER FUNCTIONALITIES REMAIN THE SAME ==============

// Sidebar active item handling
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications') {
            document.querySelector('.notifications-popup').
            style.display = 'none';
        } else {
            document.querySelector('.notifications-popup').
            style.display = 'block';
            document.querySelector('#notifications .notification-count').
            style.display = 'none';
        }
    })
})

// Message search functionality
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1) {
            user.style.display = 'flex'; 
        } else {
            user.style.display = 'none';
        }
    })
}

messageSearch.addEventListener('keyup', searchMessage);

// Highlight message card when clicked
messageNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messageNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    }, 2000);
})

// Function to search for posts
function search() {
    const query = document.getElementById('searchInput').value;
  
    fetch(`http://localhost:5000/api/search?q=${query}`)
      .then(response => response.json())
      .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
  
        data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.innerHTML = `
            <h3>${post.creator}</h3>
            <p>Inspiration: ${post.inspiration}</p>
            <p>Project: ${post.project}</p>
            <p>${post.content}</p>
          `;
          resultsDiv.appendChild(postElement);
        });
      })
      .catch(error => console.error('Error fetching posts:', error));
  }
  
  // Function to show the create post modal
  function openCreateModal() {
    document.getElementById('createModal').style.display = 'block';
  }
  
  // Handle form submission to create a post
  document.getElementById('createPostForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const creator = document.getElementById('creator').value;
    const inspiration = document.getElementById('inspiration').value;
    const project = document.getElementById('project').value;
    const content = document.getElementById('content').value;
  
    fetch('http://localhost:5000/api/create-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creator,
        inspiration,
        project,
        content
      })
    })
      .then(response => response.json())
      .then(data => {
        alert('Post created successfully');
        document.getElementById('createModal').style.display = 'none';
      })
      .catch(error => console.error('Error creating post:', error));
  });
  