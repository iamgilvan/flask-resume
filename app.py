from pathlib import Path

import yaml
from flask import Flask, render_template, request, send_from_directory
from jinja2 import StrictUndefined

app = Flask(__name__)

app.jinja_env.undefined = StrictUndefined

BASE_DIR = Path(__file__).resolve().parent
CONFIG_DIR = BASE_DIR / "config"

LANGUAGES = {
    "en": "resume_en.yaml",
    "pt-br": "resume_pt_br.yaml",
}


def load_resume(language: str) -> dict:
    """Load resume content from the YAML file for the selected language."""
    filename = LANGUAGES.get(language)

    if not filename:
        abort(404)

    config_file = CONFIG_DIR / filename

    with config_file.open(encoding="utf-8") as file:
        return yaml.safe_load(file)


@app.route("/")
def index():
    
    requested_language = request.args.get("lang", "en").lower()
    language = requested_language if requested_language in LANGUAGES else "en"

    resume = load_resume(language)
    alternate_language = "pt-br" if language == "en" else "en"

    resume = load_resume(language)

    return render_template(
        "index.html",
        resume=resume,
        lang=language,
        alternate_lang=alternate_language,
    )

@app.route("/download/cv")
def download_cv():
    documents_dir = BASE_DIR / "static" / "assets" / "documents"

    return send_from_directory(
        documents_dir,
        "gilvan-almeida-cv.pdf",
        as_attachment=True,
        download_name="Gilvan-Almeida-CV.pdf",
    )


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )