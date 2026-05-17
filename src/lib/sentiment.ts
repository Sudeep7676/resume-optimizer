/**
 * Client-side keyword-based sentiment analyzer
 * No external API needed — uses curated dictionaries
 */

const POSITIVE_WORDS = new Set([
    'amazing', 'awesome', 'beautiful', 'best', 'brilliant', 'clean', 'cool',
    'easy', 'effective', 'elegant', 'excellent', 'exceptional', 'fantastic',
    'fast', 'friendly', 'good', 'gorgeous', 'great', 'helpful', 'impressive',
    'incredible', 'innovative', 'intuitive', 'love', 'loved', 'magnificent',
    'nice', 'outstanding', 'perfect', 'polished', 'powerful', 'premium',
    'professional', 'quality', 'recommend', 'recommended', 'reliable',
    'remarkable', 'responsive', 'seamless', 'simple', 'sleek', 'smooth',
    'solid', 'stunning', 'superb', 'superior', 'terrific', 'top', 'useful',
    'valuable', 'wonderful', 'wow', 'better', 'improved', 'saves', 'saved',
    'efficient', 'quick', 'modern', 'fresh', 'delightful', 'enjoy', 'enjoyed',
]);

const NEGATIVE_WORDS = new Set([
    'awful', 'bad', 'broken', 'bug', 'buggy', 'clunky', 'complicated',
    'confusing', 'crash', 'crashed', 'crashes', 'difficult', 'disappointing',
    'error', 'fail', 'failed', 'frustrating', 'glitch', 'horrible', 'issue',
    'issues', 'lag', 'laggy', 'mediocre', 'missing', 'outdated', 'poor',
    'problem', 'problems', 'rough', 'slow', 'terrible', 'ugly', 'unfriendly',
    'unintuitive', 'unreliable', 'unusable', 'useless', 'weak', 'worse',
    'worst', 'wrong', 'annoying', 'hate', 'hated', 'painful', 'stuck',
    'doesn\'t work', 'not working', 'broken', 'disappointed', 'lacks',
]);

const INTENSIFIERS = new Set([
    'very', 'really', 'extremely', 'absolutely', 'incredibly', 'highly',
    'super', 'truly', 'totally', 'completely', 'so', 'exceptionally',
]);

const TAG_KEYWORDS: Record<string, string[]> = {
    'ats-friendly': ['ats', 'ats-friendly', 'applicant tracking'],
    'latex': ['latex', 'overleaf', 'tex'],
    'easy-to-use': ['easy', 'simple', 'intuitive', 'user-friendly', 'straightforward'],
    'professional': ['professional', 'polished', 'clean', 'premium'],
    'design': ['design', 'ui', 'theme', 'dark mode', 'dark theme', 'beautiful', 'gorgeous'],
    'ai': ['ai', 'artificial intelligence', 'generated', 'suggestions', 'smart'],
    'fast': ['fast', 'quick', 'speed', 'efficient', 'saves time'],
    'templates': ['template', 'templates', 'format', 'layout'],
    'export': ['export', 'download', 'pdf', 'overleaf'],
    'interview': ['interview', 'job', 'hired', 'offer', 'callback'],
    'formatting': ['formatting', 'format', 'structured', 'organized'],
    'mobile': ['mobile', 'responsive', 'phone', 'tablet'],
    'bug': ['bug', 'error', 'crash', 'broken', 'glitch', 'issue'],
    'feature-request': ['wish', 'would love', 'hope', 'suggest', 'suggestion', 'add', 'feature'],
};

export interface SentimentResult {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number; // 0 to 1 (0 = very negative, 1 = very positive)
    tags: string[];
    confidence: number; // 0 to 1
}

export function analyzeSentiment(text: string): SentimentResult {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);

    let positiveScore = 0;
    let negativeScore = 0;
    let intensifierActive = false;

    for (const word of words) {
        const cleanWord = word.replace(/[^a-z'-]/g, '');

        if (INTENSIFIERS.has(cleanWord)) {
            intensifierActive = true;
            continue;
        }

        const multiplier = intensifierActive ? 1.5 : 1;

        if (POSITIVE_WORDS.has(cleanWord)) {
            positiveScore += multiplier;
        }

        if (NEGATIVE_WORDS.has(cleanWord)) {
            negativeScore += multiplier;
        }

        intensifierActive = false;
    }

    // Check multi-word negative phrases
    const negPhrases = ['doesn\'t work', 'not working', 'not good', 'not great', 'could be better'];
    for (const phrase of negPhrases) {
        if (lower.includes(phrase)) {
            negativeScore += 2;
        }
    }

    // Check multi-word positive phrases
    const posPhrases = ['highly recommend', 'love it', 'well done', 'great job', 'saved time', 'top notch'];
    for (const phrase of posPhrases) {
        if (lower.includes(phrase)) {
            positiveScore += 2;
        }
    }

    const total = positiveScore + negativeScore;
    const confidence = Math.min(total / 6, 1); // Normalize confidence

    let sentiment: 'positive' | 'neutral' | 'negative';
    let score: number;

    if (total === 0) {
        sentiment = 'neutral';
        score = 0.5;
    } else {
        const ratio = positiveScore / total;
        score = Math.round(ratio * 100) / 100;

        if (ratio >= 0.65) {
            sentiment = 'positive';
        } else if (ratio <= 0.35) {
            sentiment = 'negative';
        } else {
            sentiment = 'neutral';
        }
    }

    // Extract tags
    const tags: string[] = [];
    for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) {
                tags.push(tag);
                break;
            }
        }
    }

    return { sentiment, score, tags: tags.slice(0, 5), confidence };
}

export function getSentimentEmoji(sentiment: 'positive' | 'neutral' | 'negative'): string {
    switch (sentiment) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        default: return '😐';
    }
}

export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'negative'): string {
    switch (sentiment) {
        case 'positive': return 'text-green-400';
        case 'negative': return 'text-red-400';
        default: return 'text-yellow-400';
    }
}

export function getSentimentBgColor(sentiment: 'positive' | 'neutral' | 'negative'): string {
    switch (sentiment) {
        case 'positive': return 'bg-green-500/10 border-green-500/20';
        case 'negative': return 'bg-red-500/10 border-red-500/20';
        default: return 'bg-yellow-500/10 border-yellow-500/20';
    }
}
