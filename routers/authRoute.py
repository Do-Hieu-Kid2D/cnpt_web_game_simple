from flask import Blueprint, request, redirect, make_response
from repositories.authRepositories import AuthRepositories
from flask import jsonify
import base64

auth_rt = Blueprint('auth', __name__, url_prefix='/auth')


@auth_rt.route('/login', methods=['POST'])
async def login():
    db = AuthRepositories()
    await db.connect()

    try:
        username = request.form['username']
        password = request.form['password']
        login_result = await db.login(username, password)
        if len(login_result) > 0:
            resp = make_response(redirect('/choosegame'))
            fullname = login_result[0]['fullname']
            encoded_bytes = base64.b64encode(fullname.encode('utf-8'))  # Mã hóa chuỗi
            print(encoded_bytes)  #
            resp.set_cookie('user', username, max_age=24*60*60)
            resp.set_cookie('pass', password, max_age=24*60*60)
            # base64.b64encode(fullname.encode('utf-8'))
            resp.set_cookie('fullname', encoded_bytes.decode('utf-8') , max_age=24*60*60)
            return resp
        else:
            return redirect('/dnsai')
    except Exception as error:
        print("Lỗi:", error)
    finally:
        await db.end()

@auth_rt.route('/loginat', methods=['POST'])
async def logiat():
    db = AuthRepositories()
    await db.connect()

    try:
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            username = request.form['username']
            password = request.form['password']

        login_result = await db.login(username, password)
        print(login_result)
        if login_result:
            return jsonify({'status': 'success', 'user': login_result}), 200
        else:
            return jsonify({'status': 'fail', 'message': 'Invalid credentials'}), 401
    except Exception as error:
        print("Lỗi:", error)
        return jsonify({'status': 'fail', 'message': 'Bad Request'}), 400
    finally:
        await db.end()


@auth_rt.route('/logout', methods=['POST'])
def logout():
    resp = make_response(redirect('/'))
    resp.delete_cookie('user')
    resp.delete_cookie('pass')
    resp.delete_cookie('name')
    return resp
