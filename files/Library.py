class book:

    def __init__(self, ID, name, price):                                    # Constructor
        self.ID = ID
        self.name = name
        self.price = price

    def show(self):                                                         # Called to show the details of a book
        print(self.ID, self.name, self.price)

    def get_attribute_string(self):                                         # Shows a certain book as a string with underscores in between
        print(str(self.ID) + '_' + str(self.name) + '_' + str(self.price))

    def get_id(self):                                                       # Gives the ID of a book
        print(self.ID)

    def get_name(self):                                                     # Gives the name of a book
        print(self.name)

    def get_price(self):                                                    # Gives the price of a book
        print(self.price)


class Library:
    def __init__(self):                                                     # Constructor
        self.books = []

    def add_book(self, Book):                                               # Adds a book to a library
        self.books.append(Book)

    def remove_book(self, Book):                                            # Removes a book from a library
        self.books.remove(Book)

    def show_id(self, ID):                                                  # Shows the name and price of a book given its ID, if no such ID is present, shows an empty list
        matching_ids = [book for book in self.books if book.ID == ID]
        return [(book.name, book.price) for book in matching_ids]

    def show_all(self):                                                     # Shows all the books in a certain library
        for Book in self.books:
            Book.show()


if __name__ == '__main__':
    lib = Library()
    book1 = book(1, 'Bookname1', "$30")
    book2 = book(2, 'Bookname2', "$10")
    book3 = book(3, 'Bookname3', "$40")
    lib.add_book(book1)
    lib.add_book(book2)
    lib.add_book(book3)
    lib.remove_book(book1)
    lib.show_all()
    print(lib.show_id(1))