from flask import Blueprint, request, redirect, make_response, jsonify
from flask import render_template
game_rt = Blueprint('games', __name__, url_prefix='/games')

@game_rt.route('/ran', methods=['GET'])
async def ran():
        return render_template('ran.html')

@game_rt.route('/caro', methods=['GET'])
async def caro_onl():
        return render_template('caro-onl.html')