let quizData = null;  // Will hold the loaded quiz data
let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = 'all'; // Valeur par défaut

// Fetch the quiz data from quiz.json
$(document).ready(function () {
    // Charger les données du quiz
    $.getJSON('quiz.json', function(data) {
        quizData = data.categories; // Load categories to quizData
        console.log('Quiz data loaded successfully');
    }).fail(function() {
        alert('Erreur lors du chargement des questions du quiz');
    });

    // Gérer la sélection de catégorie
    $('.category-btn').on('click', function () {
        // Retirer la classe active de tous les boutons
        $('.category-btn').removeClass('ring-4 ring-blue-300');
        // Ajouter la classe active au bouton cliqué
        $(this).addClass('ring-4 ring-blue-300');
        
        selectedCategory = $(this).data('category');
        console.log('Category selected:', selectedCategory);
    });

    // Commencer le quiz
    $('#start-btn').on('click', function () {
        // Vérifier que les données sont chargées
        if (!quizData) {
    alert('Les questions sont en cours de chargement...');
    return;
        }

        // Vérifier qu'une catégorie est sélectionnée
        if (!selectedCategory || !quizData[selectedCategory]) {
            alert('Veuillez sélectionner une catégorie');
            return;
        }

        // Réinitialiser le quiz
        currentQuestionIndex = 0;
        score = 0;
        updateScore();

        // Afficher l'écran du quiz
        $('#start-screen').addClass('hidden');
        $('#quiz-screen').removeClass('hidden');
        $('#total-questions').text(quizData[selectedCategory].length);
        
        loadQuestion();
    });

    function loadQuestion() {
        const currentQuestion = quizData[selectedCategory][currentQuestionIndex];
        
        // Mettre à jour le numéro de question
        $('#current-question').text(currentQuestionIndex + 1);
        
        // Afficher la question
        $('#question-text').text(currentQuestion.question);
        
        // Afficher la référence si elle existe
        if (currentQuestion.reference) {
            $('#reference').text(currentQuestion.reference).removeClass('hidden');
        } else {
            $('#reference').addClass('hidden');
        }
        
        // Vider le conteneur d'options
        $('#options-container').empty();

        // Créer les boutons de réponse
        currentQuestion.answers.forEach((answer, index) => {
            $('#options-container').append(`
                <button class="answer-btn bg-blue-300 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mb-2 w-full" data-index="${index}">
                    ${answer}
                </button>
            `);
        });

        // Réinitialiser le feedback
        $('#feedback').text('').removeClass('text-green-600 text-red-600');
    }

    // Gérer le clic sur une réponse
    $(document).on('click', '.answer-btn', function () {
        const selectedAnswerIndex = $(this).data('index');
        const currentQuestion = quizData[selectedCategory][currentQuestionIndex];

        // Désactiver tous les boutons après sélection
        $('.answer-btn').prop('disabled', true).addClass('opacity-50');

        // Vérifier la réponse
        if (selectedAnswerIndex === currentQuestion.correct) {
            score++;
            updateScore();
            $(this).removeClass('bg-blue-300').addClass('bg-green-500');
            $('#feedback').text('✅ Correct !').addClass('text-green-600');
        } else {
            $(this).removeClass('bg-blue-300').addClass('bg-red-500');
            // Mettre en surbrillance la bonne réponse
            $(`.answer-btn[data-index="${currentQuestion.correct}"]`).removeClass('bg-blue-300').addClass('bg-green-500');
            $('#feedback').text('❌ Incorrect ! La bonne réponse était : ' + currentQuestion.answers[currentQuestion.correct]).addClass('text-red-600');
        }

        // Afficher le bouton suivant
        $('#next-btn').removeClass('hidden');
    });

    // Passer à la question suivante
    $('#next-btn').on('click', function () {
        if (currentQuestionIndex < quizData[selectedCategory].length - 1) {
            currentQuestionIndex++;
            loadQuestion();
            $('#feedback').text('');
            $(this).addClass('hidden');
            // Réactiver les boutons
            $('.answer-btn').prop('disabled', false).removeClass('opacity-50');
        } else {
            showResults();
        }
    });

    // Mettre à jour l'affichage du score
    function updateScore() {
        $('#score').text(score);
    }

    // Afficher les résultats
    function showResults() {
        $('#quiz-screen').addClass('hidden');
        $('#results-screen').removeClass('hidden');
        $('#final-score').text(score);
        $('#max-score').text(quizData[selectedCategory].length);

        // Message personnalisé selon le score
        const percentage = (score / quizData[selectedCategory].length) * 100;
        let message = '';

        if (percentage === 100) {
            message = '🎉 Parfait ! Vous êtes un expert biblique !';
        } else if (percentage >= 80) {
            message = '👏 Excellent ! Très bonne connaissance de la Bible !';
        } else if (percentage >= 60) {
            message = '👍 Bien ! Continuez à étudier la Parole !';
        } else if (percentage >= 40) {
            message = '📖 Pas mal ! Lisez davantage votre Bible !';
        } else {
            message = '💪 Continuez vos efforts ! La Bible a encore beaucoup à vous apprendre !';
        }

        $('#result-message').text(message);
    }

    // Recommencer le quiz
    $('#restart-btn').on('click', function () {
        currentQuestionIndex = 0;
        score = 0;
        selectedCategory = 'all';
        
        $('#results-screen').addClass('hidden');
        $('#start-screen').removeClass('hidden');
        $('#score').text(score);
        
        // Retirer la sélection visuelle des catégories
        $('.category-btn').removeClass('ring-4 ring-blue-300');
    });
});