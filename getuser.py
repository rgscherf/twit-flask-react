import requests
import dateutil.parser as du 
import dateutil.tz as tz


def date_from_timestamp(ts):
    eastern = tz.tzstr("EST5EDT")
    date = du.parse(ts).astimezone(eastern)
    datestr = date.strftime("%b %d %Y, %I:%M %p")
    return datestr


def get_commits(user):
    events_url = "https://api.github.com/users/{0}/events".format(user["login"])
    events = requests.get(events_url)
    dirty_events = events.json()

    clean_events = []
    for e in dirty_events:
        if e["type"] == "PushEvent":
            for c in e["payload"]["commits"]:
                repo_url = "https://github.com/{0}".format(e["repo"]["name"])
                out = {
                    "message": c["message"],
                    "repo_name": e["repo"]["name"],
                    "repo_url": repo_url,
                    "commit_url": "{0}/commit/{1}".format(repo_url, c["sha"]),
                    "sha": c["sha"][:7],
                    "timestamp_raw": e["created_at"], # for proper sorting by time
                    "timestamp_pretty": date_from_timestamp(e["created_at"]) # what's actually displayed
                }
                clean_events.append(out)

    clean_events = sorted(clean_events, key=lambda k: k["timestamp_raw"], reverse=True)
    return clean_events

def get_basic_info(name):
    user_url = "https://api.github.com/users/" + name
    user_response = requests.get(user_url)
    user = user_response.json()
    ret = {
        "avatar_url": user["avatar_url"],
        "html_url": user["html_url"],
        "login": user["login"],
        "name": user["name"],
        "public_repos": user["public_repos"]
    }
    return ret

def getuser(login):
    user = get_basic_info(login)
    user["commits"] = get_commits(user)
    return user
