import * as cheerio from 'cheerio';

export interface ScrapedData {
    title: string;
    description: string;
    // fast checks for keywords
    hasFinancials: boolean;
}

export const fetchUrlData = async (url: string): Promise<ScrapedData | null> => {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';

        // Naive check for financial keywords
        const text = $('body').text().toLowerCase();
        const hasFinancials = text.includes('pe ratio') || text.includes('market cap') || text.includes('revenue');

        return {
            title,
            description,
            hasFinancials
        };
    } catch (error) {
        console.error('Error fetching URL:', error);
        return null;
    }
};
