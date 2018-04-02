from flask import Flask, render_template, request
import praw
import json
import io
# from praw.models import MoreComments

import simplejson
import django

app = Flask(__name__)


@app.route('/')
def function():
    return render_template('index.html')


@app.route('/handle_data', methods=['POST', 'GET'])
def handle_data():
    if request.method == 'POST':

        projectpath = request.form['projectFilepath']

        # ----------------------------------------------------------------------------------------------------------------------------------------------

        CLIENT_ID = open("client_id.txt", "r").read().splitlines()[0]
        CLIENT_SECRET = open("client_secret.txt", "r").read().splitlines()[0]
        PASSWORD = open("passwd.txt", "r").read().splitlines()[0]

        reddit = praw.Reddit(client_id=CLIENT_ID,
                             client_secret=CLIENT_SECRET,
                             password=PASSWORD,
                             user_agent='Comment Extraction by /u/ancaem10',
                             username='ancaem10')

        # print(reddit.user.me())

        submission = reddit.submission(url=projectpath)

        # ------------------------------------------------------------------------
        # output only the body of the top level comments in the thread

        # for top_level_comment in submission.comments:
        # print(top_level_comment.body)

        # ----------------------------------------------------

        # extragere doar reply la postarea initiala (de pe niv 1)

        # from praw.models import MoreComments
        # for top_level_comment in submission.comments:
        #     if isinstance(top_level_comment, MoreComments):
        #         continue
        #     print(top_level_comment.body)


        # ------------------------------------------------------------------------

        # output all second-level comments

        # submission.comments.replace_more(limit=0)
        # for top_level_comment in submission.comments:
        #     for second_level_comment in top_level_comment.replies:
        #         print(second_level_comment.body)

        # ------------------------------------------------------------------------

        # code will output all the top-level comments, followed, by second-level,
        # third-level, etc.

        # submission.comments.replace_more(limit=0)
        # comment_queue = submission.comments[:]  # Seed with top-level
        # while comment_queue:
        #     comment = comment_queue.pop(0)
        #     print(comment.body)
        #     comment_queue.extend(comment.replies)

        # or

        # submission.comments.replace_more(limit=0)
        # for comment in submission.comments.list():
        #     print(comment.body)

        # ------------------------------------------------------------------------

        # value of submission.num_comments may not match up 100% with the number
        # of comments extracted via PRAW. This discrepancy is normal as that count
        # includes deleted, removed, and spam comments.

        # print(submission.num_comments)

        # ------------------------------------------------------------------------

        # author_no_duplicates = []
        # author_list = []
        # for comment in submission.comments.list():
        #     author_list.append(comment.author)

        # for i in author_list:
        #     if i not in author_no_duplicates:
        #         author_no_duplicates.append(i)

        # for i in author_no_duplicates:
        #     print str(i)

        # for i in author_no_duplicates:
        #     if i == "schamdea":
        #         for comment in submission.comments.list():
        #             print comment.body

        # user = reddit.redditor('schamdea')
        # for comment in user.get_comments(limit=None):
        #     print comment.body

        # ----------------------------------------------------

        # trimitere nume neduplicate

        # author_no_duplicates = []
        # for i in author_list:
        #     if i not in author_no_duplicates:
        #         author_no_duplicates.append(i)

        # with open('graph-json.txt', 'w') as outfile:
        #     for i in author_no_duplicates:
        #         json.dump(str(i), outfile)

        # ----------------------------------------------------

        # extragere autori + comentarii in fisiere separate
        # BFS
        # author_list = []
        #
        # for comment in submission.comments.list():
        #     author_list.append(comment.author)

        # with open('author-json.txt', 'w') as outfile:
        #     for author in author_list:
        #         json.dump(str(author), outfile)

        # with open('comment-json.txt', 'w') as outfile:
        #     for comment in submission.comments.list():
        #         json.dump(comment.body, outfile)

        # ----------------------------------------------------

        # # scriere in fisier doar reply la postarea initiala (comentariile de pe nivelul 1)
        # with open('comment.json', 'w') as outfile:
        #     submission.comments.replace_more(limit=0)
        #     for top_level_comment in submission.comments:
        #         json.dump(top_level_comment.body, outfile)
        #
        # # scriere in fisier doar autori de pe nivelul 1
        # author_list = []
        #
        # submission.comments.replace_more(limit=0)
        # for top_level_comment in submission.comments:
        #     author_list.append(top_level_comment.author)
        #
        # with open('author.json', 'w') as outfile:
        #     for author in author_list:
        #         json.dump(str(author), outfile)

        # ----------------------------------------------------


        try:
            to_unicode = unicode
        except NameError:
            to_unicode = str

        author_list = []
        comment_list = []
        data = []
        for top_level_comment in submission.comments:
            author_list.append(top_level_comment.author)

        submission.comments.replace_more(limit=0)
        for top_level_comment in submission.comments:
            comment_list.append(top_level_comment.body)

        author_num = len(author_list)
        # comment_num = len(comment_list)

        # autorul postarii
        submitter = submission.author

        # titlu postare
        top_question = submission.title

        data.append({'submitter': str(submitter), 'question': top_question, 'redditLink': str(projectpath)})

        # data.append({'redditLink': str(projectpath)})

        for i in range(author_num):
            data.append({'author': str(author_list[i]), 'comment': comment_list[i]})

        with io.open('./static/data_refresh.json', 'w', encoding='utf8') as outfile:
            str_ = json.dumps(data,
                              indent=4,
                              sort_keys=True,
                              separators=(',', ': '),
                              ensure_ascii=False)
            outfile.write(to_unicode(str_))

        with open('./static/data_refresh.json') as data_file:
            data_loaded = json.load(data_file)

        # ----------------------------------------------------------------------------------------------------------------------------------------------


        # vreau ca projectpath sa ajunga in js
        # print projectpath


        return projectpath


if __name__ == '__main__':
    app.run()
