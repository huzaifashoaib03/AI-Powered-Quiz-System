
  // ========= CONFIGURATION =========
  // Yahan apna Cloudflare Worker URL confirm karein
  const WORKER_URL = 'https://groqkey.bismasaith4.workers.dev';

  let state = { questions: [], current: 0, score: 0, userAnswers: [], config: {} };

  function showScreen(id) {
    ['config-screen','loader-screen','quiz-screen','result-screen'].forEach(s => {
      const el = document.getElementById(s);
      if(el) el.classList.add('hidden');
    });
    const target = document.getElementById(id);
    if(target) target.classList.remove('hidden');
  }

  function showError(msg) {
    console.error("Quiz System Error:", msg);
    const toast = document.getElementById('error-toast');
    if(toast) {
      toast.textContent = '⚠️ ' + msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 5000);
    }
  }

  /* ============================================================
     STEP 1: GENERATE QUIZ (Calling Worker)
  ============================================================ */
  async function startQuiz() {
    const subject = document.getElementById('subject').value.trim();
    const topic = document.getElementById('topic').value.trim();
    const numQ = parseInt(document.getElementById('num-questions').value);
    const diff = document.getElementById('difficulty').value;

    if (!subject || !topic) return showError('Please fill all fields.');
    
    state.config = { subject, topic, numQ, diff };
    showScreen('loader-screen');

    // Prompt optimized for JSON Mode
    const prompt = `Generate a JSON object with a key "questions" containing ${numQ} MCQs about "${topic}" in "${subject}" (${diff} level). 
    Each item must have: "question", "options" (array of 4 strings starting with A), B), C), D)"), and "answer" (single letter A, B, C, or D).`;

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.5
        })
      });

      if (!res.ok) throw new Error(`Network Error: ${res.status}`);

      const data = await res.json();
      
      // JSON Mode response usually needs one more parse
      let content = data.choices[0].message.content;
      if (typeof content === 'string') {
          content = JSON.parse(content);
      }
      
      state.questions = content.questions || content;

      if (!Array.isArray(state.questions) || state.questions.length === 0) {
        throw new Error('Could not find questions array in AI response');
      }

      state.current = 0; 
      state.score = 0; 
      state.userAnswers = [];
      
      renderQuestion();
      showScreen('quiz-screen');
      
    } catch (err) {
      console.error("Full Trace:", err);
      showScreen('config-screen');
      showError('System Busy. Please wait 5 seconds and try again.');
    }
  }

  /* ============================================================
     STEP 2: RENDER QUESTION
  ============================================================ */
  function renderQuestion() {
    const q = state.questions[state.current];
    
    // UI Updates
    document.getElementById('progress-text').textContent = `Question ${state.current + 1} of ${state.questions.length}`;
    document.getElementById('progress-fill').style.width = ((state.current / state.questions.length) * 100) + '%';
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('score-live').textContent = `Score: ${state.score}`;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    ['A','B','C','D'].forEach((letter, i) => {
      const div = document.createElement('div');
      div.className = 'option';
      div.id = `opt-${letter}`;
      
      // AI check for option existence
      const rawOpt = q.options[i] || "Option not provided";
      const cleanOpt = rawOpt.replace(/^[A-D]\)\s*/, ''); // Remove existing "A)" if any

      div.innerHTML = `<div class="opt-letter">${letter}</div><span>${cleanOpt}</span>`;
      div.onclick = () => selectAnswer(letter, q.answer);
      container.appendChild(div);
    });

    document.getElementById('next-btn').classList.add('hidden');
  }

  /* ============================================================
     STEP 3: HANDLE ANSWER SELECTION
  ============================================================ */
  function selectAnswer(chosen, correct) {
    const options = document.querySelectorAll('.option');
    options.forEach(el => el.classList.add('disabled'));
    
    state.userAnswers[state.current] = chosen;
    
    const selectedEl = document.getElementById(`opt-${chosen}`);
    const correctEl = document.getElementById(`opt-${correct}`);

    if (chosen === correct) {
      if(selectedEl) selectedEl.classList.add('selected-correct');
      state.score++;
    } else {
      if(selectedEl) selectedEl.classList.add('selected-wrong');
      if(correctEl) correctEl.classList.add('reveal-correct');
    }
    
    document.getElementById('score-live').textContent = `Score: ${state.score}`;
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.remove('hidden');
    nextBtn.style.display = 'block';
    nextBtn.textContent = (state.current === state.questions.length - 1) ? 'SEE RESULTS →' : 'NEXT QUESTION →';
  }

  function nextQuestion() {
    if (state.current < state.questions.length - 1) {
      state.current++; 
      renderQuestion();
    } else {
      showResults();
    }
  }

  /* ============================================================
     STEP 4: SHOW RESULTS
  ============================================================ */
  function showResults() {
    showScreen('result-screen');
    const scoreDisplay = document.getElementById('final-score-num');
    if(scoreDisplay) scoreDisplay.textContent = `${state.score}/${state.questions.length}`;

    const container = document.getElementById('review-container');
    container.innerHTML = '';

    state.questions.forEach((q, i) => {
      const userAns = state.userAnswers[i];
      const isCorrect = userAns === q.answer;
      
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <div style="font-weight:600; margin-bottom:5px;">Q${i+1}: ${q.question}</div>
        <div style="font-size:0.85rem; color: ${isCorrect ? 'var(--correct)' : 'var(--wrong)'}">
            ${isCorrect ? '✅ Correct' : '❌ Wrong'} | Your Answer: ${userAns} | Correct: ${q.answer}
        </div>
      `;
      container.appendChild(item);
    });
  }

  function restartQuiz() { startQuiz(); }
  function goToConfig() { showScreen('config-screen'); }
