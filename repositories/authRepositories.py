import mysql.connector
from mysql.connector import Error
import aiomysql

class AuthRepositories:
    def __init__(self):
        self.connection = None

    async def connect(self):
        try:
            self.connection = await aiomysql.connect(
                host="localhost",
                user="root",
                password="",
                db="cnpm"
            )
            if self.connection:
                print("Kết nối thành công đến MySQL")
        except Exception as e:
            print("Lỗi kết nối:", e)

    async def start_transaction(self):
        if self.connection:
            async with self.connection.cursor() as cursor:
                await cursor.execute('START TRANSACTION')

    async def commit_transaction(self):
        if self.connection:
            await self.connection.commit()

    async def query(self, sql, params=None):
        try:
            async with self.connection.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(sql, params)
                result = await cursor.fetchall()
                print(f"===>NEW query SQL: {sql} với tham số {params}")
                return result
        except Exception as e:
            print(f"Lỗi thực thi query: {e}")
            return None

    async def execute(self, sql, params=None):
        try:
            async with self.connection.cursor() as cursor:
                await cursor.execute(sql, params)
                await self.connection.commit()
                print(f"===>SQL Executed: {sql} với tham số {params}")
        except Exception as e:
            print(f"Lỗi thực thi query: {e}")
            await self.connection.rollback()
            return None

    async def register(self, fullname, username, password, email):
        sql = "INSERT INTO users (username, password, fullname, email) VALUES (%s, %s, %s, %s)"
        params = (username, password, fullname, email)
        await self.execute(sql, params)
        
    async def login(self, username, password):
        sql = "SELECT * FROM users WHERE username = %s AND password = %s"
        params = (username, password)
        return await self.query(sql, params)

    async def end(self):
        if self.connection:
            self.connection.close()
            print("Đã đóng kết nối MySQL")