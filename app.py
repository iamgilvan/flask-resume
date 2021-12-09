import oyaml as yaml
from flask import Flask
from flask import render_template

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


@app.route('/')
def index():
    website_data = yaml.safe_load(open('_config.yaml', encoding='utf8'))

    return render_template('index.html', data=website_data)


@app.route('/pt-br')
def version_pt_br():
    website_data = yaml.safe_load(open('_config-pt-br.yaml', encoding='utf8'))

    return render_template('index.html', data=website_data, language='pt-br')


if __name__ == '__main__':
    app.run(port=5000)
