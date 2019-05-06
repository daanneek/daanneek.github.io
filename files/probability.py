import random
import time


def case(rolls, s1, s2, case_num):
    win = 0
    for u in range(rolls):
        score1 = sum(random.choices(list(s1[1]), list(map(s1[2], range(len(s1[1])))), k=s1[0]))
        score2 = sum(random.choices(list(s2[1]), list(map(s2[2], range(len(s2[1])))), k=s2[0]))
        if score1 > score2:
            win = win + 1
            sentence = win/100000
    print("The probability that player one wins is " + str(sentence) + ".(Case "+case_num+")")


def case4(rolls):
    win = 0
    s1 = (6, {1, 2, 3, 4}, [1/3, 1/5, 1/7, 1/3])
    s2 = (4, {1, 2, 3, 4, 5, 6}, lambda x: 1 / 6)
    for u in range(rolls):
        score1 = sum(random.choices(list(s1[1]), s1[2], k=s1[0]))
        score2 = sum(random.choices(list(s2[1]), list(map(s2[2], range(len(s2[1])))), k=s2[0]))
        if score1 > score2:
            win = win + 1
            sentence = win / 100000
    print("The probability that player one wins is " + str(sentence) + ".(Case 4)")


start = time.time()

case(100000, (9, {1, 2, 3, 4}, lambda x: 1 / 4), (6, {1, 2, 3, 4, 5, 6}, lambda x: 1/6), '1')
case(100000, (1, set(range(1, 36 + 1)), lambda x: 1 / 36),(36, {0, 1}, lambda x: 1 / 2), '2')
case(100000, (6, {1, 2, 3, 4}, lambda x: 1 / 4),(4, {1, 2, 3, 4, 5, 6}, lambda x: 1 / 6), '3')
case4(100000)
case(100000, (55, {1, 3}, lambda x: 1/2), (20, {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, lambda x: 1/10), '5')
case(100000, (10, {1, 3}, lambda x: 1/2), (20, {0, 2}, lambda x: 1/2), '6')

end = time.time()
print('The program took ' + str((end - start)) + ' seconds to run')
