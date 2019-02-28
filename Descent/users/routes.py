from flask import render_template, request, url_for, flash, redirect, Blueprint
from flask_login import current_user, login_required, login_user, logout_user
from Descent import db, bcrypt
from Descent.users.forms import LoginForm, RegisterForm
from Descent.users.models import User
users = Blueprint(
    'users',
    __name__,
    template_folder='templates/users/',
    static_folder="static/users")


@users.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    
    if current_user.is_authenticated:
        return redirect(url_for('site.home'))


    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and \
            bcrypt.check_password_hash(
                user.password, form.password.data):
            login_user(user)
            return redirect(url_for('site.home'))
        else:
            flash('Login Failed. Check Username or Password', 'danger')
    return render_template('login.html', title='login', form=form)


@users.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_pass = bcrypt.generate_password_hash(form.password.data)
        new_user = User(
            username=form.username.data,
            password=hashed_pass
        )
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('site.home'))
    return render_template("register.html", form=form)

@users.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("site.home"))