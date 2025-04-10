
# Django Celery

### need to add task:
    
    from django_celery_beat.models import PeriodicTask, IntervalSchedule
    import json

    schedule, created = IntervalSchedule.objects.get_or_create(
        every=10,
        period=IntervalSchedule.MINUTES,  
    )
    
    PeriodicTask.objects.create(
        interval=schedule,
        name='Parse RSS Feeds',
        task='news.tasks.parse_rss_feeds', 
        enabled=True,
        args=json.dumps([]),  
    )

# Run

### one console - run worker:

    celery -A core worker -l INFO -E

### another console - run beat:
    
    celery -A core beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler