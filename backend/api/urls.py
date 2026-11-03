from django.urls import path
from . import views
urlpatterns = [
    path("portfolio/", views.portfolio),
    path("contact/", views.contact),
]
