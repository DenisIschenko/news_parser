from rest_framework import serializers

from .models import NewsArticle


class NewsArticleSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(many=False, read_only=True, slug_field='name')

    class Meta:
        model = NewsArticle
        fields = '__all__'
