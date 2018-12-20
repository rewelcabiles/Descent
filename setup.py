from setuptools import setup

setup(
        name='The Descent',
        packages=['Descent'],
        version='0.0.1',
        include_package_data=True,
        description="Test",
        zip_safe=False,
        install_requires=[
            'flask',
            'Flask-WTF',
            'WTforms',
            'flask-login',
            'flask_sqlalchemy',
            'flask_bcrypt',
            'pymysql',
            'flask-socketio'
            ]
        )
