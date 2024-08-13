from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from projectAPP.serializers import UserSerializer
from bs4 import BeautifulSoup
import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import Offer
import requests
from bs4 import BeautifulSoup
import re

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Invalid Credentials'}, status=400)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
def remove_after_zl(text):
    return re.sub(r'\s*zł.*', '', text)


def remove_after_zl1(text):
    # Usuń wszystkie białe znaki (w tym spacje) po 'zł'
    text = re.sub(r'\s*zł.*', '', text)
    # Usuń wszystkie spacje z całego tekstu
    text = text.replace(' ', '')
    return text       

def search_offers(request):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'}
    if request.method == 'GET':
        location = request.GET.get('location')
        price_max = request.GET.get('price_max')
        area_min = request.GET.get('area_min')
        area_max = request.GET.get('area_max')

        # Utwórz URL do web scrapingu na podstawie danych z formularza
        base_url = 'https://www.otodom.pl/pl/wyniki/wynajem/mieszkanie/zachodniopomorskie/'
        url = f"{base_url}{location}/{location}/{location}?limit=10&priceMax={price_max}&areaMin={area_min}&areaMax={area_max}&by=DEFAULT&direction=DESC&viewType=listing"
        url1 = "https://www.otodom.pl"

        base_url_olx = "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/"
        url_olx = f"{base_url_olx}{location}/?search%5Bfilter_float_price:to%5D={price_max}&search%5Bfilter_float_m:from%5D={area_min}&search%5Bfilter_float_m:to%5D={area_max}"
        url2 = 'https://www.olx.pl'
        
        base_url_mor = "https://www.morizon.pl/do-wynajecia/mieszkania/"
        url_mor = f"{base_url_mor}{location}/?ps[living_area_from]={area_min}&ps[living_area_to]={area_max}&ps[price_to]={price_max}"
        url3 = 'https://www.morizon.pl'

        try:
            response = requests.get(url,headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            offers = []
            counter_otodom = 0
            
            lokalizacje = soup.findAll("p", {"class": "css-1dvtw4c eejmx80"})
            links = soup.findAll('a', {"data-cy": "listing-item-link"})
            ceny = soup.findAll('span', {"class": "css-1uwck7i evk7nst0"})
            desc = soup.findAll('dl', {"class": "css-uki0wd e1clni9t1"})
            imgs = soup.findAll('img', {'data-cy': 'listing-item-image-source'})
            for lokalizacja, link, cena, descc, img in zip(lokalizacje, links, ceny, desc,imgs):  # Pobierz maksymalnie 5 ofert
                if counter_otodom >= 3:
                    break

                lokacja = lokalizacja.text.strip().split(", ")
                descc1 = descc.text.replace("Liczba pokoi", "").replace("pokójPowierzchnia", "").replace("pokojePowierzchnia", "").replace("m²", "").replace("Piętro", "").replace("piętro", "").split(" ")
                cena = cena.text.strip().replace("+ czynsz:", "").replace("zł/miesiąc", "")
                gocena = remove_after_zl(cena)
                if "parter" in descc1:
                    descc1[descc1.index("parter")] = '1'
                
                if len(lokacja) == 4:
                    link_href = link.get('href')
                    all_link = url1 + link_href
                    imgs_href = img.get('src')

                    # Zapisz ofertę do bazy danych
                    offer_otodom = Offer.objects.create(
                        location=lokacja[2],
                        district=lokacja[1],
                        street=lokacja[0],
                        rooms=descc1[0],
                        area=descc1[1],
                        price=gocena,
                        url=all_link,
                        img=imgs_href
                    )
                    offers.append(offer_otodom)
                    counter_otodom += 1

            response_olx = requests.get(url_olx,headers=headers)
            soup_olx = BeautifulSoup(response_olx.text, 'html.parser')
            ceny_olx = soup_olx.findAll("p",{"class":"css-tyui9s er34gjf0"})
            loc_olx = soup_olx.findAll("p",{"class","css-1a4brun er34gjf0"})
            links_olx=soup_olx.findAll('a', {"class": "css-z3gu2d"})
            places_olx = soup_olx.findAll('span',{"class":"css-643j0o"})
            imgs_olx = soup_olx.findAll('img', {'class': 'css-8wsg1m'})
            counter_olx = 0

            links_olx = links_olx[::2]
            for cena_olx,lo_olx,link_olx,place_olx,img_olx in zip(ceny_olx,loc_olx,links_olx,places_olx,imgs_olx):
                if counter_olx >= 3:
                    break
                
                cen1 = re.sub(r'\D', '', cena_olx.text)
                ll=lo_olx.text.split(' - ')[0]
                ll=ll.split(',')
    
                orplace=place_olx.text.replace("m²","").replace(",", ".").strip()
                link1=link_olx['href']
                link=url2+link1
                imgs_href1 = img_olx.get('src')

                offer_olx = Offer.objects.create(
                    location=ll[0],
                    district=ll[1],
                    street='Niewykryto',
                    rooms=0,
                    area=orplace,
                    price=cen1,
                    url=link,
                    img=imgs_href1
                )
                offers.append(offer_olx)
                counter_olx += 1

# MORIZON
            response_mor = requests.get(url_mor,headers=headers)
            soup_mor = BeautifulSoup(response_mor.text, 'html.parser')
            ceny_mor = soup_mor.findAll("div",{"class":"_49d7Ys"})
            loc_mor = soup_mor.findAll("span",{"class","d33Dxw"})
            links_mor=soup_mor.findAll('a', {"class": "_-5qra7"})
            places_mor = soup_mor.findAll('div',{"class":"property-info"})
            imgs_mor = soup_mor.findAll('img', {'class': 'gallery-slider__img'})
            counter_mor = 0

            for cena_mor,lo_mor,link_mor,place_mor,img_mor in zip(ceny_mor,loc_mor,links_mor,places_mor,imgs_mor):
                if counter_mor >= 3:
                    break


                link2=link_mor['href']
                link_morr=url3+link2

                cena_mor=cena_mor.text.replace("zł","")
                cena_mor=remove_after_zl1(cena_mor)
                lo_mor=lo_mor.text.strip()
                if lo_mor.endswith(" \xa0•"):
                    lo_mor = lo_mor[:-3]
                
                li_mor = lo_mor.split(" \xa0•\xa0 ")


                place_mor=place_mor.text.replace("m²•","").replace("pokój•","")
                place_mor=place_mor.split()    
                imgs_mori = img_mor.get('src')

                offer_mor = Offer.objects.create(
                    location=li_mor[0],
                    district=li_mor[1],
                    street='Niewykryto',
                    rooms=place_mor[1],
                    area=place_mor[0],
                    price=cena_mor,
                    url=link_morr,
                    img=imgs_mori
                )
                offers.append(offer_mor)
                counter_mor += 1

            return JsonResponse({'message': 'Offers fetched and saved successfully.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
            # Pobierz dane ofert
            # Przykładowe parsowanie dla miejscowości, ceny, powierzchni i URL
         

def offer_list(request):
    if request.method == 'GET':
        offers = Offer.objects.all()
        data = {'offers': list(offers.values())}
        return JsonResponse(data, safe=False)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)