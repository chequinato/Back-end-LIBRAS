const allVideos = [
    {
        title: "Teste 1 - casa",
        link: "https://www.youtube.com/watch?v=tVtclOJuGnM"
    },
    {
        title: "Teste 2",
        link: "https://www.youtube.com/watch?v=wIonxZzgsl8"
    },
    {
        title: "Teste 3",
        link: "https://www.youtube.com/watch?v=szuof33c1aM"
    },
    {
        title: "Teste 4",
        link: "https://www.youtube.com/watch?v=N4UAPm5Ok6U&feature=youtu.be"
    }
];

// Função para exibir vídeos
const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos-container');
    videosContainer.innerHTML = ''; // Limpa o contêiner

    videos.forEach((video) => {
        const videoDiv = document.createElement('div');
        const iframe = document.createElement('iframe');
        iframe.width = "600";
        iframe.height = "340";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        const id = video.link.split('v=')[1];
        iframe.setAttribute("src", `https://www.youtube.com/embed/${id}?controls=0&autoplay=1`);
        
        videoDiv.appendChild(iframe);
        videosContainer.appendChild(videoDiv);
    });

    console.log('Vídeos exibidos com sucesso!');
}

// Função para buscar vídeos
const searchVideos = (query) => {
    const filteredVideos = allVideos.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    displayVideos(filteredVideos);
}

// Função para filtrar vídeos por categoria
const filterVideosByCategory = (category) => {
    if (category === 'todas') {
        displayVideos(allVideos);
    } else {
        const filteredVideos = allVideos.filter(item => item.title.toLowerCase().includes(category.toLowerCase()));
        displayVideos(filteredVideos);
    }
}

// Adicionar eventos para o botão de busca
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    searchVideos(query);
});

// Adicionar evento para tecla ENTER no campo de busca
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('search-input').value;
        searchVideos(query);
    }
});

// Adicionar eventos para os botões de categorias
const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const category = event.target.getAttribute('data-category');
        filterVideosByCategory(category);
    });
});

// Carregar vídeos ao carregar a página
window.onload = () => displayVideos(allVideos);
