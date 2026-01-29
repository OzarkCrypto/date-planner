import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const modeDescriptions = {
  1: {
    name: '소박한 노포',
    budget: '1인당 SGD 15 이하',
    vibe: '오래된 로컬 맛집, 호커센터, 저렴하고 정겨운 분위기',
  },
  2: {
    name: '분위기 캐주얼',
    budget: '1인당 SGD 30-40',
    vibe: '분위기 좋은 캐주얼 레스토랑, 인스타그래머블하지만 부담없는',
  },
  3: {
    name: '기념일 스페셜',
    budget: '1인당 SGD 100+',
    vibe: '파인다이닝급, 특별한 날을 위한 고급 레스토랑',
  },
};

export async function POST(request) {
  try {
    const { mode } = await request.json();
    
    if (!mode || !modeDescriptions[mode]) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const modeInfo = modeDescriptions[mode];

    const prompt = `싱가포르 Aljunied/Geylang 지역에서 출발하는 데이트 코스를 추천해줘.

조건:
- 무드: ${modeInfo.name}
- 예산: ${modeInfo.budget}
- 분위기: ${modeInfo.vibe}
- 이동거리: 대중교통 기준 30분~1시간 이내
- 코스 구성: 식사 → 카페 (또는 디저트) → 선택적 활동

3개의 코스를 추천해줘. 각 코스는 다음 형식으로:

**코스 1: [테마 이름]**
🍽️ 식사: [장소명] - [간단 설명, 추천 메뉴, 대략적 가격]
☕ 카페: [장소명] - [간단 설명]
🎯 활동 (선택): [장소명] - [간단 설명]
📍 동선: [간단한 이동 경로]

실제로 존재하는 장소만 추천하고, 구체적인 정보를 포함해줘.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const recommendation = message.content[0].text;

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}
