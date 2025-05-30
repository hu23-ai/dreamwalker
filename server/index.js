const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 정적 파일 제공 (html, css, js 등)
app.use(express.static(path.join(__dirname, '../')));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/main.html'));
});

// OpenAI GPT 응답
app.post('/chat', async (req, res) => {
  const messages = req.body.messages;

  if (!Array.isArray(messages) || messages.some(m => typeof m.content !== 'string')) {
    return res.status(400).json({ reply: '❌ 잘못된 메시지 형식입니다.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || '⚠️ 응답 없음' });

  } catch (error) {
    console.error('🔥 OpenAI 통신 에러:', error);
    res.status(500).json({ reply: 'Error communicating with OpenAI API' });
  }
});

// 감성 추천 라우트 (OpenRouter)
app.post('/emotional', async (req, res) => {
  const summary = req.body.summary;

  const system = {
    role: "system",
    content: `
[System]
역할: AI 가상 여행 가이드 (자기 전 상상 여행 동반자)
스타일: 감성적이고 따뜻한 안내자
목표: 사용자가 자기 전에 감정에 맞는 여행을 상상하며, 하루를 편안하게 마무리할 수 있도록 몰입감 있는 가상 여행을 친구와 대화하듯이 유도해주세요.
과정: 아래 지시사항을 순서대로 이행해 주세요.

[지시사항]
요약된 여행 조건을 바탕으로 하루 일정을 감성적으로 추천해주세요.
여행의 6단계(여행 시작, 오전, 점심, 오후, 저녁, 마무리)와 {추천한 장소: [...]}를 포함해 감성적으로 작성하세요. 문단마다 '**1. 여행 시작**'와 같은 마크다운 제목 스타일을 꼭 사용하세요.
마지막에는 하루 중 가장 추천하고 싶은 “한 곳”을 골라,  
반드시 “구글맵에서 검색 가능한 공식 명칭(한글+영문 가능)”만  
{추천 장소: "장소명(영문 공식명, 도시, 나라)"}  
이렇게 한 곳만 출력하세요.

예:  
{추천 장소: "루브르 박물관(Musée du Louvre, Paris, France)" }

[제한]
- 문장은 100자 이내
- 장소, 풍경, 대화 등 오감 묘사
- 따뜻한 말투, 존댓말
- 한국어
    `.trim()
  };

  const user = {
    role: "user",
    content: `사용자 요약 응답: ${JSON.stringify(summary)}`
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [system, user]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || null;
    res.send(content);
  } catch (err) {
    res.status(500).send("❗ OpenRouter 요청 실패");
  }
});

// 구글 장소 좌표 변환
app.get('/geocode', async (req, res) => {
  const place = req.query.place;
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "❌ Google 지오코딩 요청 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
