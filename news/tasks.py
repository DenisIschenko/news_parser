from email.utils import parsedate_to_datetime

import feedparser
from celery import shared_task
from dateutil import parser

from .models import RSSFeed, NewsArticle, Category


@shared_task
def parse_rss_feeds():
    feeds_counter = 0
    feeds = RSSFeed.objects.all()
    for feed in feeds:
        print(f"Parsing {feed.url}...")
        parsed_feed = feedparser.parse(feed.url)
        for entry in parsed_feed.entries:
            # print(f"Processing {entry.title}...")
            # print(f"attrs: {entry.keys()}")

            category_name = entry.get('category',
                                      entry.get('tags', ['Uncategorized'])[0])  # Якщо немає категорії – "Uncategorized"

            # Знаходимо або створюємо категорію
            category, _ = Category.objects.get_or_create(name=category_name)

            converted_date = None
            # Конвертуємо дату з RSS
            if hasattr(entry, 'published'):
                try:
                    converted_date = parsedate_to_datetime(entry.published)
                except ValueError:
                    try:
                        converted_date = parser.parse(entry.published)
                    except ValueError:
                        print(f"⚠️ Неможливо розпарсити дату: {entry.published}")

            # Додаємо новину з прив’язкою до категорії
            NewsArticle.objects.get_or_create(
                url=entry.link,
                defaults={
                    'title': entry.title,
                    'content': entry.get('summary', entry.get('description', '')),
                    'source': parsed_feed.feed.title,
                    'published_at': converted_date,
                    'category': category
                }
            )
        print(f"Parsed {len(parsed_feed.entries)} Articles.")
    return f"Parsed {feeds.count()} RSS feeds."


@shared_task
def test_task():
    print("✅ Test task executed!")
