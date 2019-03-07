
"""Crawling engine for <https://www.footsell.com>
I use chrome driver

File:
    cstockx.py

Author:
    Buffed. Kim Kiseop


dependency:
    BeautifulSoup, selenium, Chrome Driver

"""

import requests
import time
from bs4 import BeautifulSoup
from selenium import webdriver

browser=webdriver.Chrome('chromedriver')

def crawling( b, page=1, limit=0 ):
    """Crawl "Sneaker Market" page and print informations
       title, price, url-link, if used, date, size
    
    It's URL is "https://footsell.com/g2/bbs/board.php?bo_table=m51"

    Args:
        b (Object): Webdriver Object. It is created by upper code "webdriver.Chrome('chromedriver')"
        page (int): Current page number
        limit (int): Last page number for crawling. (limit==0 means crawling infinitly)

    Returns:
        None

    Example:
        >> browser = webdriver.Chrome('chromedriver')
        >> crawling( browser, 1, 3 )

        Page 1
        ...

        Page 2
        ...

        Page 3
        ...

    TODO:
        Connect To DB (mysql)
        Mapping data to English data from "stockx"
    """
        

    print("*****\n*\n* page",page,"\n*\n*\n*****")
    b.get('https://footsell.com/g2/bbs/board.php?bo_table=m51&page='+str(page))
    html = browser.page_source
    soup = BeautifulSoup(html, 'html.parser')

    Subject = soup.select('.list_market_subject_div')
    for i in Subject:
        price = 0
        title = ''
        link = ''
        size = ''
        ifUsed = ''
        date = ''
    
        _title = i.select('.list_subject_a')
        _price = i.select('.list_market_price')
        _ifUsed = i.select('.list_market_used')
        _size = i.select('.list_market_size')
        _date = i.select('.list_table_dates')


        for j in _title:
            title=j.get_text('',strip='True')
            link=j['href']

        for j in _price:
            price = j.get_text('',strip='True')

        for j in _ifUsed:
            ifUsed = j.get_text()!="새제품"

        for j in _size:
            size = j.get_text()

        for j in _date:
            date = j.get_text('',strip='True')

        print(price,title)
    if(page != limit):
        crawling( browser, page+1, limit )
crawling( browser, 1, 0 )

browser.close()
