---
layout: post
title: "最大字串问题"
excerpt: "寻找两个字符串中的最大字串问题，是算法中的经典问题，出现在面试和实际应用中，屡见不鲜。本文给出了C++中的实现。"
category: development
tags: [program]
disqus: true
---

# Longest Common Substring
最长最大字串问题

## 算法

* [数组](http://www.sourcetricks.com/2012/07/longest-common-substring-problem.html#.WUPNsROGOCQ)

* [前缀树](http://www.talkativeman.com/longest-common-substring-algorithm/)

## 字符编码

* [多字节编码与 Unicode 码](http://wiki.jikexueyuan.com/project/visual-studio/14.html)

## ASCII编码

* [char to ascii int value](https://stackoverflow.com/questions/15999272/how-to-convert-an-ascii-char-to-its-ascii-int-value)

* [Scanning ASCII value of each character of a string](https://stackoverflow.com/questions/13412206/scanning-ascii-value-of-each-character-of-a-string)

* [ascii对照表](http://www.learncpp.com/cpp-tutorial/27-chars/)

* [ascii为负数的情况](https://stackoverflow.com/questions/4690415/negative-ascii-value)

### Usage

```
std::string input1 = "收益 费用";
std::string input2 = "快速 费用 赎回办理";
std::cout << "---- strings ---" << endl;
std::cout << "input1:" << input1 << " length:" << input1.size() << endl;
std::cout << "input2:" << input2 << " length:" << input2.size() << endl;
std::string result;
std::cout << "---- result ----" << endl;
if(longestCommonSubstring(input1, input2, result)){
  std::cout << "longest common string: " << result << endl;
  std::cout << "length:" << result.size() << endl;
} else {
  std::cout << "can not find longest common string." << endl;
}
```

> longestCommonSubstring支持中英，过滤unprintable chars。如果存在最大字串，返回**true**，否则**false**.


## C++ Impl
```
using namespace std;
bool longestCommonSubstring(const string& str1, const string& str2, string& result)
{
  if(str1.empty() || str2.empty())
  {
    return false;
  }
  int *curr = new int [str2.size()];
  int *prev = new int [str2.size()];
  int *swap = NULL;
  int maxSubstr = 0;
   string longest;
  for(unsigned int i = 0; i < str1.size(); ++i)
  {
    for(unsigned int j = 0; j < str2.size(); ++j)
    {
      // std::cout << "compare str1[" << i << "]:" << str1[i] << ", str2["<<j<<"]:" << str2[j] << endl;
      if(str1[i] != str2[j])
      {
        curr[j] = 0;
      }
      else
      {
        if(i == 0 || j == 0)
        {
          curr[j] = 1;
        }
        else
        {
          curr[j] = 1 + prev[j-1];
        }
          if(maxSubstr < curr[j])
        {
          maxSubstr = curr[j];
             longest.clear();
        }
          if (maxSubstr == curr[j])
          {
            longest += str1.substr(i - maxSubstr + 1, i + 1);
          }
      }
    }
    swap=curr;
    curr=prev;
    prev=swap;
  }

  delete [] curr;
  delete [] prev;
  result = longest.substr(0, maxSubstr);

  if(result.size() == 0){
    return false;
  } else if(result.size() == 1 && (int(*result.c_str()) < 32)){ /* escape unprintable chars */
    return false;
  }
  return true;
}
``` 