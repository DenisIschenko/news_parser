from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=250, unique=True, db_index=True)

    def __str__(self):
        return self.name


class NewsArticle(models.Model):
    id = models.BigAutoField(primary_key=True)  # Явний ідентифікатор
    title = models.CharField(max_length=255, db_index=True)  # Індексований заголовок
    url = models.URLField(unique=True, max_length=512)  # Унікальний індекс
    content = models.TextField()
    source = models.CharField(max_length=100, db_index=True)  # Джерело новини
    published_at = models.DateTimeField(db_index=True, null=True, blank=True)  # Дата публікації
    created_at = models.DateTimeField(auto_now_add=True)  # Дата додавання в БД
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, db_index=True)

    class Meta:
        indexes = [
            # Прискорює запити на пошук або сортування за датою публікації:
            # latest_news = NewsArticle.objects.order_by('-published_at')
            models.Index(fields=['published_at']),  # Прискорює пошук за датою публікації
            # Прискорює сортування за часом додавання:
            # recently_added = NewsArticle.objects.order_by('-created_at')
            models.Index(fields=['created_at']),  # Прискорює сортування за часом додавання
            # Оптимізує запити, де ми шукаємо новини з певного джерела за датою:
            # cnn_news = NewsArticle.objects.filter(source="CNN").order_by('-published_at')
            models.Index(fields=['source', 'published_at']), # Комбінований індекс (швидкий пошук новин за джерелом і датою)
        ]

    def __str__(self):
        return self.title


class RSSFeed(models.Model):
    url = models.URLField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
