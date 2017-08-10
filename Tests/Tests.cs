using NUnit.Framework;

namespace Intel.Skeleton.Test
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void Test1()
        {
            Assert.True(true);
        }

        [Test]
        public void Test2()
        {
            Assert.False(false);
        }

        [Test]
        [Ignore("Not Implemented")]
        public void Test3()
        {
            Assert.True(true);
        }
    }
}